import {
  IStoreModel,
  ISessionModel,
  ISessionState,
  ISessionUser,
  ISessionToken,
  ISessionActions,
  ISessionThunks,
  IFetchResult,
} from "./model.typing";
import { thunk, action, computed, actionOn } from "easy-peasy";
import SsrCookie from "ssr-cookie";
import * as C from "../const";
import { getAjaxUrl, getLoginUrl, stripTags, getRestApiUrl } from "../utilities/utilities";
import * as utils from "../utilities/utilities";

const sessionUserState: ISessionUser = {
  id: "",
  databaseId: 0,
  username: "",
  slug: "",
  email: "",
  fullName: "",
  firstName: "",
  lastName: "",
  profileURL: "",
  memberRole: "",
  itvAvatar: "",
  itvAvatarFile: null,
  cover: "",
  coverFile: null,
  authorReviewsCount: 0,
  solvedTasksCount: 0,
  doerReviewsCount: 0,
  isPasekaMember: false,
  isPartner: false,
  organizationName: "",
  organizationLogo: "",
  organizationLogoFile: null,
  organizationDescription: "",
  organizationSite: "",
  xp: 0,
  phone: "",
  skype: "",
  twitter: "",
  telegram: "",
  facebook: "",
  vk: "",
  instagram: "",
  itvRole: null,
};

const sessionTokenState: ISessionToken = {
  timestamp: 0,
  authToken: "",
  refreshToken: "",
};

const sessionState: ISessionState = {
  isLoaded: false,
  user: sessionUserState,
  token: sessionTokenState,
  validToken: computed([state => state.token], ({ timestamp, authToken, refreshToken }) =>
    Date.now() - timestamp < Number(process.env.AuthTokenLifeTimeMs) ? authToken : refreshToken
  ),
  isLoggedIn: computed([state => state.user.databaseId], userId => Boolean(userId)),
  isAdmin: computed([state => state.user.isAdmin], isAdmin => Boolean(isAdmin)),
  isTaskAuthorLoggedIn: computed(
    [
      state => state.user.databaseId,
      (state, storeState) => storeState.components.task?.author?.databaseId,
    ],
    (userId, authorId) => {
      return Boolean(userId) && Boolean(authorId) && userId === authorId;
    }
  ),
  isUserTaskCandidate: computed(
    [state => state.user.id, (state, storeState) => storeState.components.task?.doers],
    (userId, doers) =>
      Boolean(userId) && Array.isArray(doers) && doers.findIndex(doer => doer.id === userId) >= 0
  ),
  canUserReplyToComment: computed(
    [
      state => state.user.databaseId,
      (state, storeState) => storeState.components.task?.author?.databaseId,
      (state, storeState) => storeState.components.task?.doers,
    ],
    userId => Boolean(userId)
  ),
  isAccountOwner: computed(
    [state => state.user.slug, (state, storeState) => storeState.entrypoint.page.slug],
    (userSlug, pageSlug) => {
      if (!pageSlug) return false;

      const destructedUri = pageSlug.match(/members\/([^/|\s]+)/);

      if (Object.is(destructedUri, null)) {
        return false;
      } else {
        const [, memberSlug] = destructedUri;
        return userSlug === memberSlug.toLowerCase();
      }
    }
  ),
};

export const queriedFields = {
  token: Object.keys(sessionTokenState) as Array<keyof ISessionToken>,
  user: Object.keys(sessionUserState) as Array<keyof ISessionUser>,
};

export const graphqlQuery = {
  login: `
  mutation LoginUser($mutationId: String!, $username: String!, $password: String!) {
    login( input: {
      clientMutationId: $mutationId,
      username: $username,
      password: $password
    } ) {
      ${queriedFields.token.filter(field => field !== "timestamp").join("\n")}
      user {
        ${queriedFields.user.join("\n")}
      }
    }
  }`,
};

export async function authorizeSessionSSRFromRequest(req, res):Promise<ISessionState> {
  const cookieSSR = new SsrCookie(req, res);
  const session = await authorizeSessionSSR(cookieSSR);

  if(!session.user.databaseId && decodeURIComponent(req.headers.cookie).match(/wordpress_logged_in_[^=]+=([^|]+)/)) {
    session.isLoaded = false;
  }

  return session;
}

export async function authorizeSessionSSR(cookieSSR):Promise<ISessionState> {
  const guestSession = {
    token: { timestamp: Date.now(), authToken: null, refreshToken: null },
    user: sessionUserState,
    isLoaded: true,
  } as ISessionState;

  try {
    const cookieAuthToken = cookieSSR.get(C.ITV_COOKIE.AUTH_TOKEN.name);
    console.log("cookieAuthToken:", cookieAuthToken);
    if(!cookieAuthToken) {
      return guestSession;
    }

    const result = await fetch(getRestApiUrl("/itv/v1/auth/validate-token"), {
      method: "post",
      headers: {
        Authorization: "Bearer " + cookieAuthToken,
      }
    });

    console.log("result.ok:", result.ok);
    
    if(result.ok) {
      const {
        token: authToken,
        user: user,
      } = await (<
        Promise<{
          token: string;
          user: any;
        }>
      >result.json());

      console.error("set session isLoaded on ok");
      // console.log("authToken:", authToken);
      // console.log("user:", user);

      return {
        token: { timestamp: Date.now(), authToken, refreshToken: null },
        user,
        isLoaded: true,
      } as ISessionState;

    }
    else {

      const {
        code: errorCode,
        message: errorMessage,
      } = await (<
        Promise<{
          code: string;
          message: string;
        }>
      >result.json());

      console.error("authorizeSessionSSR errorCode:", errorCode);
      console.error(stripTags(errorMessage));
      console.error("authorizeSessionSSR set session isLoaded on fail");

    }
  } catch (error) {
    console.error("authorizeSessionSSR exception:", error);
  }

  return guestSession;
}

const sessionActions: ISessionActions = {
  setStateGuest: action((state) => {
    state.isLoaded = true;
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setIsLoaded: action((state, payload) => {
    state.isLoaded = payload;
  }),
  setSubscribeTaskList: action((state, payload) => {
    state.user.subscribeTaskList = payload;
  }),
  setUserItvRole: action((state, payload) => {
    state.user.itvRole = payload;
  }),
  onMemberAccountTemplateChange: actionOn(
    (actions, storeActions) => storeActions.components.memberAccount.setTemplate,
    (state, { payload: { template } }) => {
      if (state.isAccountOwner) {
        state.user.itvRole = template === "volunteer" ? "doer" : "author";
      }
    }
  ),
  loadSubscribeTaskList: thunk(actions => {
    const action = "get-task-list-subscription";
    utils.tokenFetch(utils.getAjaxUrl(action), {
      method: "get",
    })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "fail") {
            return utils.showAjaxError({ message: result.message });
          }

          actions.setSubscribeTaskList(result.filter);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }),
  setUserAvatar: action((state, payload) => {
    state.user.itvAvatar = payload;
  }),
  setUserAvatarFile: action((state, payload) => {
    state.user.itvAvatarFile = payload;
  }),
  setUserCover: action((state, payload) => {
    state.user.cover = payload;
  }),
  setUserCoverFile: action((state, payload) => {
    state.user.coverFile = payload;
  }),
};

const sessionThunks: ISessionThunks = {
  login: thunk(async ({ setState, setIsLoaded } /*, { username, password }*/) => {
    // const { request } = await import("graphql-request");
    // const { v4: uuidv4 } = await import("uuid");
    // const loginQuery: string = graphqlQuery.login;

    console.log("sessionThunks...");

    try {
      const result = await fetch(getAjaxUrl("itv-get-jwt-auth-token"), {
        method: "post",
      });

      const {
        status: responseStatus,
        message: responseMessage,
        authToken: authToken,
        refreshToken: refreshToken,
        user: user,
      } = await (<
        Promise<{
          status: string;
          message: string;
          authToken: string;
          refreshToken: string;
          user: any;
        }>
      >result.json());

      // console.log("authToken:", authToken)

      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
        console.error("set session isLoaded on fail");

        setState({
          token: { timestamp: Date.now(), authToken: null, refreshToken: null },
          user: sessionUserState,
          isLoaded: true,
        });
      } else {
        console.error("set session isLoaded on ok");

        setState({
          token: { timestamp: Date.now(), authToken, refreshToken },
          user,
          isLoaded: true,
        });
      }
    } catch (error) {
      console.error("set session isLoaded on exception");
      setIsLoaded(true);
      console.error(error);
    }

    // const {
    //   login: { authToken, refreshToken, user },
    // } = await request(process.env.GraphQLServer, loginQuery, {
    //   mutationId: uuidv4(),
    //   username,
    //   password,
    // });

    // setState({
    //   token: { timestamp: Date.now(), authToken, refreshToken },
    //   user,
    // });
  }),
  register: thunk(async (actions, { formData, successCallbackFn, errorCallbackFn }) => {
    try {
      const result = await utils.tokenFetch(getAjaxUrl("user-register"), {
        method: "post",
        body: utils.formDataToJSON(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { status: responseStatus, message: responseMessage } = await (<Promise<IFetchResult>>(
        result.json()
      ));
      if (responseStatus === "fail") {
        errorCallbackFn(stripTags(responseMessage));
      } else {
        successCallbackFn(responseMessage);
      }
    } catch (error) {
      console.error(error);
      errorCallbackFn("Во время регистрации произашла ошибка.");
    }
  }),
  userLogin: thunk(async (actions, { formData, successCallbackFn, errorCallbackFn }) => {
    try {
      const result = await utils.tokenFetch(getRestApiUrl("/itv/v1/auth/login"), {
        method: "post",
        body: utils.formDataToJSON(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(result.ok) {

        const {
          token: authToken,
          user: user,
        } = await (<
          Promise<{
            token: string;
            user: any;
          }>
        >result.json());

        console.error("set session isLoaded on ok");

        actions.setState({
          token: { timestamp: Date.now(), authToken, refreshToken: null },
          user,
          isLoaded: true,
        });

        successCallbackFn();

      }
      else {

        const {
          code: errorCode,
          message: errorMessage,
        } = await (<
          Promise<{
            code: string;
            message: string;
          }>
        >result.json());

        console.error("errorCode:", errorCode);
        console.error(stripTags(errorMessage));
        console.error("set session isLoaded on fail");

        errorCallbackFn(stripTags(errorMessage));
      }

    } catch (error) {
      console.error(error);
      errorCallbackFn("Во время входа произашла ошибка.");
    }
  }),
  resetPassword: thunk(async (actions, { userLogin, successCallbackFn, errorCallbackFn }) => {
    try {
      const formData = new FormData();
      formData.append("user_login", String(userLogin));

      const result = await utils.tokenFetch(getAjaxUrl("reset-password"), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<Promise<IFetchResult>>(
        result.json()
      ));

      if (responseStatus === "error") {
        errorCallbackFn(stripTags(responseMessage));
      } else {
        successCallbackFn();
      }
    } catch (error) {
      console.error(error);
      errorCallbackFn("Не удалось отправить пароль.");
    }
  }),
  changePassword: thunk(
    async (actions, { newPassword, key, successCallbackFn, errorCallbackFn }) => {
      try {
        const formData = new FormData();
        formData.append("pass1", String(newPassword));
        formData.append("pass2", String(newPassword));
        formData.append("rp_key", String(key));

        const result = await utils.tokenFetch(getLoginUrl() + "?action=resetpass", {
          method: "post",
          body: formData,
        });

        const text = result.ok ? await result.text() : "";

        if (text.match(/Ваш новый пароль вступил в силу/)) {
          successCallbackFn();
        } else {
          errorCallbackFn("Не удалось задать пароль.");
        }
      } catch (error) {
        console.error(error);
        errorCallbackFn("Не удалось задать пароль.");
      }
    }
  ),
  setRole: thunk(
    async (actions, { itvRole, successCallbackFn, errorCallbackFn }, { getStoreState }) => {
      const {
        session: { user, validToken: token },
      } = getStoreState() as IStoreModel;

      const formData = new FormData();
      formData.append("itv_role", itvRole);
      formData.append("auth_token", String(token));

      try {
        const result = await utils.tokenFetch(getRestApiUrl(`/itv/v1/member/${user.slug}/itv_role`), {
          method: "POST",
          body: formData,
        });

        if (result.status !== 200) {
          const { message: responseMessage } = await result.json();
          errorCallbackFn(stripTags(responseMessage));
        } else {
          successCallbackFn();
        }
      } catch (error) {
        console.error(error);
        errorCallbackFn("Не удалось установить роль.");
      }
    }
  ),
  authorizeSession: thunk(async ({ setState, setIsLoaded }) => {
    try {
      const result = await utils.tokenFetch(getRestApiUrl("/itv/v1/auth/validate-token"), {
        method: "post",
      });

      if(result.ok) {

        const {
          token: authToken,
          user: user,
        } = await (<
          Promise<{
            token: string;
            user: any;
          }>
        >result.json());

        console.error("set session isLoaded on ok");

        setState({
          token: { timestamp: Date.now(), authToken, refreshToken: null },
          user,
          isLoaded: true,
        });

      }
      else {

        const {
          code: errorCode,
          message: errorMessage,
        } = await (<
          Promise<{
            code: string;
            message: string;
          }>
        >result.json());

        console.error("errorCode:", errorCode);
        console.error(stripTags(errorMessage));
        console.error("set session isLoaded on fail");

        setState({
          token: { timestamp: Date.now(), authToken: null, refreshToken: null },
          user: sessionUserState,
          isLoaded: true,
        });
      }
    } catch (error) {
      console.error("set session isLoaded on exception");
      setIsLoaded(true);
      console.error(error);
    }
  }),
};

const sessionModel: ISessionModel = {
  ...sessionState,
  ...sessionActions,
  ...sessionThunks,
};

export default sessionModel;
