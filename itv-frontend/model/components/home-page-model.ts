import {
  IHomePageState,
  IHomePageModel,
  IHomePageActions,
  IHomePageThunks,
  IMemberListItem,
  IRestApiResponse,
  IStoreModel
} from "../model.typing";
import { action, thunk, thunkOn } from "easy-peasy";
import { getRestApiUrl } from "../../utilities/utilities";

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
  loadMembersRequest: thunk(async (actions, _, { getStoreState }) => {
    const {
      app: { now }
    } = getStoreState() as IStoreModel;
    const { memberListItemQueriedFields } = await import("../../model/components/members-model");

    try {
      const requestURL = new URL(getRestApiUrl(`/itv/v1/member/ratingList/doer`));

      requestURL.search = (() => {
        return memberListItemQueriedFields.map(paramValue => `_fields[]=${paramValue}`).join("&");
      })();

      requestURL.searchParams.set("month", String(new Date(now).getMonth()));
      requestURL.searchParams.set("year", String(new Date(now).getFullYear()));
      requestURL.searchParams.set("page", "1");
      requestURL.searchParams.set("per_page", "6");

      const memberListResponse = await fetch(requestURL.toString());
      const response: IRestApiResponse & Array<IMemberListItem> = await memberListResponse.json();

      if (response.data?.status && response.data.status !== 200) {
        console.error(response.message);
      } else if (Array.isArray(response)) {
        return { memberList: response };
      }
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
