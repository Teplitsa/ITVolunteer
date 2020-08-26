import {
  IStoreModel,
  IMembersPageModel,
  IMembersPageState,
  IMembersPageActions,
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { stripTags } from "../../utilities/utilities";

export const membersPageState: IMembersPageState = {
  perPage: 14,
  paged: 1,
  list: null,
};

const memberListItemQueriedFields = `
  id
  name
`;

export const graphqlQuery = `
  query getUsers {
    users {
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
};

const membersPageModel: IMembersPageModel = {
  ...membersPageState,
  ...membersPageActions,
};

export default membersPageModel;
