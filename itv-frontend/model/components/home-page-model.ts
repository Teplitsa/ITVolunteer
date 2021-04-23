import {
  IHomePageState,
  IHomePageModel,
  IHomePageActions,
  IHomePageThunks,
  IMemberListItem,
} from "../model.typing";
import * as utils from "../../utilities/utilities";
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
  setStats: action((state, payload) => {
    state.stats = payload;
  }),
  setMemberList: action((state, { memberList }) => {
    state.memberList = memberList;
  }),
};

const homePageThunks: IHomePageThunks = {
  loadStatsRequest: thunk(async () => {
    try {
      const action = "get-task-status-stats";
      const result = await fetch(utils.getAjaxUrl(action), {
        method: "post",
      });

      const { status: responseStatus, stats: stats } = await (<
        Promise<{
          status: string;
          stats?: any;
        }>
      >result.json());

      if (responseStatus === "ok") {
        return { stats };
      }
    } catch (error) {
      console.error(error);
    }

    return { stats: null };
  }),
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
  onLoadStatsRequestSuccess: thunkOn(
    actions => actions.loadStatsRequest.successType,
    ({ setStats }, { result }) => {
      const { stats } = result;

      setStats(stats);
    }
  ),
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
