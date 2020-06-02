import {
  ISessionModel,
  ISessionState,
  ISessionUser,
  ISessionToken,
  ISessionActions,
  ISessionThunks,
} from "./model.typing";
import { thunk, action, computed } from "easy-peasy";
import { getAjaxUrl, stripTags } from "../utilities/utilities";

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
  isTaskAuthorLoggedIn: computed(
    [
      (state) => state.user.databaseId,
      (state, storeState) => storeState.components.task?.author?.databaseId,
    ],
    (userId, authorId) =>
      Boolean(userId) && Boolean(authorId) && userId === authorId
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
    (userId, authorId, doers) =>
      Boolean(userId) &&
      ((Boolean(authorId) && userId === authorId) ||
        (Array.isArray(doers) &&
          doers.findIndex((doer) => doer.databaseId === userId) >= 0))
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
};

const sessionThunks: ISessionThunks = {
  login: thunk(async ({ setState }, { username, password }) => {
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

      console.log("authToken:", authToken)

      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));

        setState({
          token: { timestamp: Date.now(), authToken: null, refreshToken: null },
          user: sessionUserState,
        });        

      } else {
        setState({
          token: { timestamp: Date.now(), authToken, refreshToken },
          user,
        });
      }

    } catch (error) {
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
