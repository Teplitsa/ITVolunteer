import {
  IStoreModel,
  IMembersPageModel,
  IMembersPageState,
  IMembersPageActions,
  IMembersPageThunks,
} from "../model.typing";
import { action, thunk } from "easy-peasy";

export const USER_PER_PAGE = 14;
export const membersPageState: IMembersPageState = {
  paged: 1,
  userListStats: {
    total: 0,
  },
  userList: null,
};

const memberListItemQueriedFields = `
  id
  slug
  itvAvatar
  fullName
  username
  memberRole
  organizationName
  organizationDescription
  rating
  reviewsCount
  xp
  solvedProblems
  facebook
  instagram
  vk
  organizationSite
  registrationDate
`;

export const graphqlQuery = `
  query getUsers($paged: Int!) {
    userListStats {
      total
    }
    userList(userPerPage: ${USER_PER_PAGE}, paged: $paged) {
      ${memberListItemQueriedFields}
    }
  }`;

const membersPageActions: IMembersPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, membersPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setPaged: action((prevState, newPaged) => {
    Object.assign(prevState, { paged: newPaged });
  }),
  setUserListStats: action((prevState, newUserListStats) => {
    Object.assign(prevState.userListStats, newUserListStats);
  }),
  addMoreVolunteers: action((prevState, newUserList) => {
    prevState.userList = [...prevState.userList, ...newUserList];
  }),
};

const membersPageThunks: IMembersPageThunks = {
  moreVolunteersRequest: thunk(
    async (
      { setPaged, setUserListStats, addMoreVolunteers },
      { setLoading },
      { getStoreState }
    ) => {
      const {
        components: {
          members: { paged },
        },
      } = getStoreState() as IStoreModel;

      const { request } = await import("graphql-request");

      try {
        const { userListStats, userList } = await request(
          process.env.GraphQLServer,
          graphqlQuery,
          {
            paged: paged + 1,
          }
        );

        setPaged(paged + 1);
        setUserListStats(userListStats);
        setLoading(false);
        addMoreVolunteers(userList);
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const membersPageModel: IMembersPageModel = {
  ...membersPageState,
  ...membersPageActions,
  ...membersPageThunks,
};

export default membersPageModel;
