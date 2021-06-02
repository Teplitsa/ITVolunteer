import {
  IStoreModel,
  IMemberListItem,
  IMembersPageModel,
  IMembersPageState,
  IMembersPageActions,
  IMembersPageThunks,
  IRestApiResponse,
  IFetchResult,
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { getAjaxUrl, getRestApiUrl, stripTags } from "../../utilities/utilities";

export const USER_RATING_START_YEAR = 2016;
export const USER_PER_PAGE = 10;

export const membersPageState: IMembersPageState = {
  userFilter: {
    month: 0,
    year: 0,
    name: "",
    page: 1,
  },
  userListStats: {
    total: 0,
  },
  userList: null,
};

export const memberListItemQueriedFields: Array<keyof IMemberListItem> = [
  "id",
  "slug",
  "fullName",
  "reviewsCount",
  "rating",
  "xp",
  "itvAvatar",
  "ratingSolvedTasksPosition",
  "isPasekaMember"
];

const membersPageActions: IMembersPageActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, membersPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setFilter: action((prevState, newFilter) => {
    Object.assign(prevState.userFilter, newFilter);
  }),
  setUserListStats: action((prevState, newUserListStats) => {
    Object.assign(prevState.userListStats, newUserListStats);
  }),
  addUsers: action((prevState, newUserList) => {
    prevState.userList = newUserList;
  }),
  addMoreUsers: action((prevState, newUserList) => {
    prevState.userList = [...prevState.userList, ...newUserList];
  }),
};

const membersPageThunks: IMembersPageThunks = {
  userListRequest: thunk(
    async (
      { setUserListStats, addUsers, addMoreUsers },
      { replaceUserList = false, setLoading, setMoreLoading },
      { getStoreState }
    ) => {
      const {
        components: {
          members: { userFilter, userListStats },
        },
      } = getStoreState() as IStoreModel;

      try {
        const requestURL = new URL(getRestApiUrl(`/itv/v1/member/ratingList/doer`));

        requestURL.search = (() => {
          return memberListItemQueriedFields.map(paramValue => `_fields[]=${paramValue}`).join("&");
        })();

        requestURL.searchParams.set("month", String(userFilter.month));
        requestURL.searchParams.set("year", String(userFilter.year));
        requestURL.searchParams.set("name", userFilter.name);
        requestURL.searchParams.set("page", String(userFilter.page));

        const memberListResponse = await fetch(requestURL.toString());
        const response: IRestApiResponse & Array<IMemberListItem> = await memberListResponse.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error(response.message);
        } else if (Array.isArray(response)) {
          setUserListStats({
            total: Number(memberListResponse.headers.get("x-wp-total") ?? userListStats.total),
          });

          if (replaceUserList) {
            addUsers(response);
          } else {
            addMoreUsers(response);
          }

          setLoading(false);
          setMoreLoading && setMoreLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  giveThanksRequest: thunk(async (_, { toUserId, setIsThanksGiven }, { getStoreState }) => {
    const {
      session: { validToken: token },
    } = getStoreState() as IStoreModel;

    const action = "thankyou";
    const formData = new FormData();

    formData.append("to-uid", String(toUserId));
    formData.append("auth_token", String(token));

    try {
      const result = await fetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<Promise<IFetchResult>>(
        result.json()
      ));
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        setIsThanksGiven(true);
      }
    } catch (error) {
      console.error(error);
    }
  }),
};

const membersPageModel: IMembersPageModel = {
  ...membersPageState,
  ...membersPageActions,
  ...membersPageThunks,
};

export default membersPageModel;
