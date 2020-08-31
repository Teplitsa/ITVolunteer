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
  list: null,
};

const memberListItemQueriedFields = `
  id
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
  query gertUsers($previousUser: String!) {
    users(first: ${USER_PER_PAGE}, after: $previousUser) {
      pageInfo {
        total
        hasNextPage
        endCursor
      }
      edges {
        node {
          ${memberListItemQueriedFields}
        }
      }
    }
  }`;

const membersPageActions: IMembersPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, membersPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setPageInfo: action((prevState, newPageInfo) => {
    Object.assign(prevState.list.pageInfo, newPageInfo);
  }),
  addMoreVolunteers: action((prevState, newEdges) => {
    prevState.list.edges = [...prevState.list.edges, ...newEdges];
  }),
};

const membersPageThunks: IMembersPageThunks = {
  moreVolunteersRequest: thunk(
    async (
      { setPageInfo, addMoreVolunteers },
      { setLoading },
      { getStoreState }
    ) => {
      const {
        components: {
          members: {
            list: {
              pageInfo: { hasNextPage, endCursor },
            },
          },
        },
      } = getStoreState() as IStoreModel;

      if (!hasNextPage) return;

      const { request } = await import("graphql-request");

      try {
        const { users } = await request(
          process.env.GraphQLServer,
          graphqlQuery,
          {
            previousUser: endCursor,
          }
        );

        setPageInfo(users.pageInfo);
        setLoading(false);
        addMoreVolunteers(users.edges);
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
