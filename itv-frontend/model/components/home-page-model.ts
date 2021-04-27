import {
  IHomePageState,
  IHomePageModel,
  IHomePageActions,
  IHomePageThunks,
  IMemberListItem,
} from "../model.typing";
import { action, thunk, thunkOn } from "easy-peasy";

const homePageState: IHomePageState = {
  template: "volunteer",
  advantageList: null,
  faqList: null,
  partnerList: null,
  reviewList: null,
  newsList: null,
  taskList: null,
  memberList: null,
  stats: null,
};

const homePageActions: IHomePageActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, homePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setTemplate: action((prevState, { template: newTemplate }) => {
    prevState.template = newTemplate;
  }),
  setMemberList: action((state, { memberList }) => {
    state.memberList = memberList;
  }),
};

const homePageThunks: IHomePageThunks = {
  loadMembersRequest: thunk(async () => {
    const { request } = await import("graphql-request");
    const { memberListItemQueriedFields } = await import("../../model/components/members-model");

    try {
      const { userList }: { userList: Array<IMemberListItem> } = await request(
        process.env.GraphQLServer,
        `query getUsers($userPerPage: Int!, $paged: Int!) {
          userList(userPerPage: $userPerPage, paged: $paged) {
            ${memberListItemQueriedFields}
          }
        }`,
        {
          userPerPage: 6,
          paged: 1,
        }
      );

      return { memberList: userList };
    } catch (error) {
      console.error(error);
    }

    return { memberList: null };
  }),
  onMemberListRequestSuccess: thunkOn(
    actions => actions.loadMembersRequest.successType,
    ({ setMemberList }, { result }) => {
      const { memberList } = result;

      setMemberList({ memberList });
    }
  ),
};

const homePageModel: IHomePageModel = {
  ...homePageState,
  ...homePageActions,
  ...homePageThunks,
};

export default homePageModel;
