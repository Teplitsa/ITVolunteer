import {
  IStoreModel,
  IMemberAccountPageModel,
  IMemberAccountPageState,
  IMemberAccountPageActions,
  IMemberAccountPageThunks,
  IPortfolioItemFormState,
  IFetchResult,
  IRestApiResponse,
  IMemberReview,
  INotification,
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import storeJsLocalStorage from "store";
import { stripTags, getAjaxUrl, getRestApiUrl } from "../../utilities/utilities";

export const memberAccountPageState: IMemberAccountPageState = {
  id: "",
  databaseId: 0,
  slug: "",
  isHybrid: false,
  template: "volunteer",
  cover: "",
  name: "",
  username: "",
  fullName: "",
  itvAvatar: "",
  rating: 0,
  reviewsCount: 0,
  xp: 0,
  organizationLogo: "",
  organizationName: "",
  organizationDescription: "",
  organizationSite: "",
  email: "",
  phone: "",
  facebook: "",
  twitter: "",
  vk: "",
  skype: "",
  telegram: "",
  isEmptyProfile: true,
  registrationDate: Date.now() / 1000,
  thankyouCount: 0,
  notificationStats: {
    project: 0,
    info: 0,
  },
  taskStats: {
    publish: 0,
    in_work: 0,
    draft: 0,
    closed: 0,
  },
  tasks: {
    filter: "open",
    page: 0,
    list: null,
  },
  reviews: {
    page: 0,
    list: null,
  },
  portfolio: {
    page: 0,
    list: null,
  },
  notifications: {
    filter: "all",
    page: 0,
    list: null,
  },
  profileFillStatus: {
    createdTasksCount: 0,
    approvedAsDoerTasksCount: 0,
    isCoverExist: false,
    isAvatarExist: false,
    isProfileInfoEnough: false,
  },
};

export const graphqlQuery: {
  member: string;
  memberTasks: string;
} = {
  member: `query getMember($username: ID!) {
    user(id: $username, idType: USERNAME) {
      ${Object.keys(memberAccountPageState)
    .filter(
      key =>
        ![
          "template",
          "notificationStats",
          "notifications",
          "taskStats",
          "tasks",
          "reviews",
          "portfolio",
          "profileFillStatus",
        ].includes(key)
    )
    .join("\n")}
    }
  }`,
  memberTasks: `query getMemberTasks($username: String!, $page: Int!) {
    memberTasks(username: $username, page: $page) {
      id
      slug
      status
      title
      content
      author {
        fullName
        memberRole
        itvAvatar
      }
      dateGmt
      doerCandidatesCount
      viewsCount
      tags(where: {hideEmpty: false, shouldOutputInFlatList: true}) {
        nodes {
          id
          name
          slug
        }
      }
      rewardTags(where: {hideEmpty: false, shouldOutputInFlatList: true}) {
        nodes {
          id
          name
          slug
        }
      }
      ngoTaskTags(where: {hideEmpty: false, shouldOutputInFlatList: true}) {
        nodes {
          id
          name
          slug
        }
      }
    }
  }`,
};

const memberAccountPageActions: IMemberAccountPageActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, memberAccountPageState);
  }),
  setState: action((prevState, newState) => {
    // console.log("memberAccountPageActions.setState...");
    Object.assign(prevState, newState);
  }),
  setTemplate: action((prevState, { template: newTemplate }) => {
    prevState.template = newTemplate;
  }),
  setAvatar: action((prevState, newItvAvatar) => {
    prevState.itvAvatar = newItvAvatar;
  }),
  setCover: action((prevState, newCover) => {
    prevState.cover = newCover;
  }),
  setThankyouCount: action((prevState, newThankyouCount) => {
    prevState.thankyouCount = newThankyouCount;
  }),
  setTaskListFilter: action((prevState, newFilter) => {
    prevState.tasks.filter = newFilter;
  }),
  setPortfolioPage: action((prevState, newPage) => {
    prevState.portfolio.page = newPage;
  }),
  showMorePortfolio: action((prevState, newPortfolio) => {
    prevState.portfolio.list = [].concat(prevState.portfolio.list, newPortfolio);
  }),
  setTasksPage: action((prevState, newPage) => {
    prevState.tasks.page = newPage;
  }),
  showMoreTasks: action((prevState, newTasks) => {
    if(prevState.tasks.list === null) {
      prevState.tasks.list = [];
    }
    prevState.tasks.list = [].concat(prevState.tasks.list, newTasks);
  }),
  setTaskList: action((prevState, newTasks) => {
    prevState.tasks.list = newTasks;
  }),
  setReviewsPage: action((prevState, newPage) => {
    prevState.reviews.page = newPage;
  }),
  showMoreReviews: action((prevState, newReviews) => {
    if(prevState.reviews.list === null) {
      prevState.reviews.list = [];
    }
    prevState.reviews.list = [].concat(prevState.reviews.list, newReviews);
  }),
  setMemberTaskStats: action((prevState, stats) => {
    prevState.taskStats = stats;
  }),
  setNotificationStats: action((prevState, stats) => {
    prevState.notificationStats = stats;
  }),
  setNotificationListFilter: action((prevState, newFilter) => {
    prevState.notifications.filter = newFilter;
  }),
  setNotifications: action((prevState, notifications) => {
    prevState.notifications = notifications;
  }),
  showMoreNotifications: action((prevState, newNotifications) => {
    prevState.notifications.list = [...prevState.notifications.list].concat(newNotifications);
  }),
  setNotificationsPage: action((prevState, newPage) => {
    prevState.notifications.page = newPage;
  }),
  setMemeberProfileFillStatus: action((prevState, profileFillStatusData) => {
    prevState.profileFillStatus = profileFillStatusData;
  }),
  setIsNeedAttentionPanelClosed: action((prevState, isClosed) => {
    prevState.isNeedAttentionPanelClosed = isClosed;
  }),
  setReviews: action((prevState, reviews) => {
    prevState.reviews = reviews;
  }),  
};

const memberAccountPageThunks: IMemberAccountPageThunks = {
  changeItvRoleRequest: thunk(async ({ setTemplate }, { itvRole }, { getStoreState }) => {
    const {
      session: { isAccountOwner, validToken: token },
      components: {
        memberAccount: { slug: userSlug },
      },
    } = getStoreState() as IStoreModel;

    if (!isAccountOwner)
      return console.error("Изменять роль в базе данных может только владелец аккаунта.");

    try {
      const memberItvRoleRequestUrl = new URL(getRestApiUrl(`/itv/v1/member/${userSlug}/itv_role`));
      const memberItvRoleRequestParams = {
        auth_token: token,
        itv_role: itvRole,
      };
      const memberItvRoleResponse = await fetch(memberItvRoleRequestUrl.toString(), {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberItvRoleRequestParams),
      });
      const response: IRestApiResponse & {
        itvRole?: "doer" | "author";
      } = await memberItvRoleResponse.json();

      if (response.data?.status && response.data.status !== 200) {
        console.error(response.message);
      } else if (typeof response === "object" && typeof response.itvRole !== "undefined") {
        setTemplate({
          template: response.itvRole === "doer" ? "volunteer" : response.itvRole,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }),
  uploadUserAvatarRequest: thunk(
    async ({ setAvatar }, { userAvatar, fileName }, { getStoreState }) => {
      if (!userAvatar || !fileName) return;

      const {
        session: { validToken: token },
      } = getStoreState() as IStoreModel;
      const action = "upload-user-avatar-v2";
      const formData = new FormData();

      formData.append("user_avatar", userAvatar, fileName);
      formData.append("auth_token", String(token));

      try {
        const result = await fetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, message: responseMessage, imageUrl } = await (<
          Promise<IFetchResult>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else {
          setAvatar(imageUrl);
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  uploadUserCoverRequest: thunk(async ({ setCover }, { userCover }, { getStoreState }) => {
    if (!userCover) return;

    const {
      session: { validToken: token },
    } = getStoreState() as IStoreModel;
    const action = "upload-user-cover";
    const formData = new FormData();

    formData.append("user_cover", userCover);
    formData.append("auth_token", String(token));

    try {
      const result = await fetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage, imageUrl } = await (<
        Promise<IFetchResult>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        setCover(imageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  getMemberPortfolioRequest: thunk(
    async ({ setPortfolioPage, showMorePortfolio }, params, { getStoreState }) => {
      const {
        components: {
          memberAccount: {
            databaseId: userId,
            portfolio: { page },
          },
        },
      } = getStoreState() as IStoreModel;
      const nextPage = page + 1;

      const memberPortfolioRequestUrl = new URL(getRestApiUrl(`/wp/v2/portfolio_work`));

      memberPortfolioRequestUrl.search = new URLSearchParams({
        page: `${nextPage}`,
        per_page: "3",
        author: `${userId}`,
      }).toString();

      try {
        const memberPortfolioResponse = await fetch(memberPortfolioRequestUrl.toString());
        const response: IRestApiResponse = await memberPortfolioResponse.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error(response.message);
        } else if (response instanceof Array && response.length > 0) {
          const portfolioList: Array<IPortfolioItemFormState> = response.map(
            ({
              id,
              slug,
              title: { rendered: renderedTitle },
              content: { rendered: renderedContent },
              featured_media: preview,
              meta: { portfolio_image_id: fullImage },
            }) => ({
              id,
              slug,
              title: stripTags(renderedTitle).trim(),
              description: stripTags(renderedContent).trim(),
              preview,
              fullImage,
            })
          );

          setPortfolioPage(nextPage);
          showMorePortfolio(portfolioList);
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  getMemberNotificationsRequest: thunk(
    async (
      { setNotifications, setNotificationsPage, showMoreNotifications },
      { isListReset },
      { getStoreState }
    ) => {
      const {
        session: { validToken: token },
        components: { memberAccount },
      } = getStoreState() as IStoreModel;
      const {
        notifications: { filter, page },
      } = memberAccount;
      const nextPage = isListReset ? 1 : page + 1;

      const memberNotificationsRequestUrl = new URL(getRestApiUrl(`/itv/v1/user-notif`));

      memberNotificationsRequestUrl.search = new URLSearchParams({
        filter,
        page: `${nextPage}`,
        per_page: "5",
        auth_token: String(token),
      }).toString();

      try {
        const memberNotificationsResponse = await fetch(memberNotificationsRequestUrl.toString());
        const response: IRestApiResponse = await memberNotificationsResponse.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error(response.message);
        } else if (response instanceof Array && response.length > 0) {
          const notificationList: Array<INotification> = response;

          setNotificationsPage(nextPage);
          isListReset
            ? setNotifications({
              filter,
              page: nextPage,
              list: notificationList,
            })
            : showMoreNotifications(notificationList);
        }
      } catch (error) {
        console.error(error);
      }

    }
  ),
  getMemberNotificationStatsRequest: thunk(
    async ({ setNotificationStats }, params, { getStoreState }) => {
      const {
        session: { validToken: token },
      } = getStoreState() as IStoreModel;

      const memberNotificationStatsRequestUrl = new URL(getRestApiUrl(`/itv/v1/user-notif/stats`));

      memberNotificationStatsRequestUrl.search = new URLSearchParams({
        auth_token: String(token),
      }).toString();

      // console.log("memberNotificationStatsRequestUrl:", memberNotificationStatsRequestUrl.toString());

      try {
        const memberNotificationStatsResponse = await fetch(
          memberNotificationStatsRequestUrl.toString()
        );
        const response: IRestApiResponse & {
          project?: number;
          info?: number;
        } = await memberNotificationStatsResponse.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error(response.message);
        } else if (typeof response.project === "number" && typeof response.info === "number") {
          setNotificationStats(response as { project: number; info: number });
        }

      } catch (error) {
        console.error(error);
      }

      // setNotificationStats({ project: 3, info: 123 });
    }
  ),
  getMemberTasksRequest: thunk(
    async ({ setTasksPage, showMoreTasks, setTaskList }, { customPage, isTaskListReset }, { getStoreState }) => {
      const {
        components: {
          memberAccount: {
            template,
            username,
            tasks: { page },
          },
        },
      } = getStoreState() as IStoreModel;
      const nextPage = customPage ?? page + 1;
      const { request } = await import("graphql-request");
      const { graphqlQuery } = await import("../../model/components/member-account-model");

      try {
        const { memberTasks: taskList } = await request(
          process.env.GraphQLServer,
          graphqlQuery.memberTasks,
          {
            username: username,
            page: nextPage,
            role: template === "volunteer" ? "doer" : "author",
          }
        );

        if (taskList.length > 0) {
          setTasksPage(nextPage);

          if(isTaskListReset) {
            setTaskList(taskList);
          }
          else {
            showMoreTasks(taskList);
          }

        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  getMemberTaskStatsRequest: thunk(async ({ setMemberTaskStats }, params, { getStoreState }) => {
    const {
      components: {
        memberAccount: { username: name, template },
      },
    } = getStoreState() as IStoreModel;

    try {
      const formData = new FormData();
      formData.append("username", String(name));
      formData.append("role", template === "volunteer" ? "doer" : "author");

      const action = "get-member-task-stats";
      const result = await fetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, data: stats } = await (<
        Promise<{
          status: string;
          data?: any;
        }>
      >result.json());

      if (responseStatus === "ok") {
        setMemberTaskStats(stats);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  getMemberReviewsRequest: thunk(
    async (
      { setReviews, setReviewsPage, showMoreReviews },
      { customPage, isReviewListReset },
      { getStoreState }
    ) => {
      const {
        components: { memberAccount },
      } = getStoreState() as IStoreModel;
      let nextPage = customPage ?? memberAccount.reviews.page + 1;

      if(!nextPage) {
        nextPage = 1;
      }

      const memberReviewsRequestUrl = new URL(
        getRestApiUrl(
          `/itv/v1/reviews/${memberAccount.template === "volunteer" ? "for-doer" : "for-author"}/${
            memberAccount.slug
          }`
        )
      );

      memberReviewsRequestUrl.search = new URLSearchParams({
        page: `${nextPage}`,
        per_page: "3",
      }).toString();

      try {
        const memberReviewsResponse = await fetch(memberReviewsRequestUrl.toString());
        const response: IRestApiResponse &
          Array<IMemberReview> = await memberReviewsResponse.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error(response.message);
        } else if (response instanceof Array && response.length > 0) {
          const reviewList: Array<IMemberReview> = response;

          if(isReviewListReset) {
            setReviews({ page: nextPage, list: reviewList });
          }
          else {
            setReviewsPage(nextPage);
            showMoreReviews(reviewList);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  giveThanksRequest: thunk(async ({ setThankyouCount }, params, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        memberAccount: { databaseId: toUid, thankyouCount },
      },
    } = getStoreState() as IStoreModel;

    const action = "thankyou";
    const formData = new FormData();

    formData.append("to-uid", String(toUid));
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
        setThankyouCount(thankyouCount + 1);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  profileFillStatusRequest: thunk(async ({ setMemeberProfileFillStatus }) => {
    const action = "get-member-profile-fill-status";

    try {
      const result = await fetch(getAjaxUrl(action), {
        method: "post",
      });

      const { status: responseStatus, message: responseMessage, data: profileFillStatus } = await (<
        Promise<IFetchResult>
      >result.json());
      if (responseStatus === "error") {
        console.error(stripTags(responseMessage));
      } else {
        setMemeberProfileFillStatus(profileFillStatus);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  storeIsNeedAttentionPanelClosed: thunk(async (_, params, { getStoreState }) => {
    const {
      components: {
        memberAccount: { isNeedAttentionPanelClosed, username },
      },
    } = getStoreState() as IStoreModel;

    await storeJsLocalStorage.set(
      `account.${username}.isNeedAttentionPanelClosed`,
      isNeedAttentionPanelClosed
    );
  }),
  loadIsNeedAttentionPanelClosed: thunk(
    async ({ setIsNeedAttentionPanelClosed }, params, { getStoreState }) => {
      const {
        components: {
          memberAccount: { username },
        },
      } = getStoreState() as IStoreModel;

      const isClosed = await storeJsLocalStorage.get(
        `account.${username}.isNeedAttentionPanelClosed`
      );
      setIsNeedAttentionPanelClosed(!!isClosed);
    }
  ),
};

const memberAccountPageModel: IMemberAccountPageModel = {
  ...memberAccountPageState,
  ...memberAccountPageActions,
  ...memberAccountPageThunks,
};

export default memberAccountPageModel;
