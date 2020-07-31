import {
  ISessionModel,
  ISessionState,
  ISessionUser,
  ISessionToken,
  ISessionActions,
  ISessionThunks,
  IFetchResult,
} from "./model.typing";
import { thunk, action, computed } from "easy-peasy";
import { getAjaxUrl, stripTags } from "../utilities/utilities";
import * as utils from "../utilities/utilities"
import * as _ from "lodash"

const sessionUserState: ISessionUser = {
  id: "",
  databaseId: 0,
  username: "",
  fullName: "",
  profileURL: "",
  memberRole: "",
  itvAvatar: "",
  authorReviewsCount: 0,
  solvedTasksCount: 0,
  doerReviewsCount: 0,
  isPasekaMember: false,
  isPartner: false,
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
  validToken: computed(
    [(state) => state.token],
    ({ timestamp, authToken, refreshToken }) =>
      Date.now() - timestamp < Number(process.env.AuthTokenLifeTimeMs)
        ? authToken
        : refreshToken
  ),
  isLoggedIn: computed([(state) => state.user.databaseId], (userId) =>
    Boolean(userId)
  ),
  isAdmin: computed([(state) => state.user.isAdmin], (isAdmin) =>
    Boolean(isAdmin)
  ),
  isTaskAuthorLoggedIn: computed(
    [
      (state) => state.user.databaseId,
      (state, storeState) => storeState.components.task?.author?.databaseId,
    ],
    (userId, authorId) => {
      return Boolean(userId) && Boolean(authorId) && userId === authorId
    }
  ),
  isUserTaskCandidate: computed(
    [
      (state) => state.user.id,
      (state, storeState) => storeState.components.task?.doers,
    ],
    (userId, doers) =>
      Boolean(userId) &&
      Array.isArray(doers) &&
      doers.findIndex((doer) => doer.id === userId) >= 0
  ),
  canUserReplyToComment: computed(
    [
      (state) => state.user.databaseId,
      (state, storeState) => storeState.components.task?.author?.databaseId,
      (state, storeState) => storeState.components.task?.doers,
    ],
    (userId, authorId, doers) => Boolean(userId)
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
      ${queriedFields.token.filter((field) => field !== "timestamp").join("\n")}
      user {
        ${queriedFields.user.join("\n")}
      }
    }
  }`,
};

const sessionActions: ISessionActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setIsLoaded: action((state, payload) => {
    state.isLoaded = payload;
  }),
  setSubscribeTaskList: action((state, payload) => {
      state.user.subscribeTaskList = payload
  }),
  loadSubscribeTaskList: thunk((actions, payload) => {
      let action = 'get-task-list-subscription'
      fetch(utils.getAjaxUrl(action), {
          method: 'get',
      })
      .then(res => {
          try {
              return res.json()
          } catch(ex) {
              utils.showAjaxError({action, error: ex})
              return {}
          }
      })
      .then(
          (result: IFetchResult) => {
              if(result.status == 'fail') {
                  return utils.showAjaxError({message: result.message})
              }

              actions.setSubscribeTaskList(result.filter)
          },
          (error) => {
              utils.showAjaxError({action, error})
          }
      )
  }),    
};

const sessionThunks: ISessionThunks = {
  login: thunk(async ({ setState, setIsLoaded }, { username, password }) => {
    const { request } = await import("graphql-request");
    const { v4: uuidv4 } = await import("uuid");
    const loginQuery: string = graphqlQuery.login;

    console.log("sessionThunks...")

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
        Promise<{ status: string; message: string; authToken: string; refreshToken: string; user: any }>
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
      setIsLoaded(true)
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
};

const sessionModel: ISessionModel = {
  ...sessionState,
  ...sessionActions,
  ...sessionThunks,
};

export default sessionModel;
