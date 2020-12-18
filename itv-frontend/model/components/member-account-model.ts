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
      ${Object.keys(memberAccountPageState).filter(
    key =>
      ![
        "notificationStats",
        "notifications",
        "taskStats",
        "tasks",
        "reviews",
        "portfolio",
        "profileFillStatus",
      ].includes(key)
  )}
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
    Object.assign(prevState, newState);
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
    prevState.tasks.list = [].concat(prevState.tasks.list, newTasks);
  }),
  setReviewsPage: action((prevState, newPage) => {
    prevState.reviews.page = newPage;
  }),
  showMoreReviews: action((prevState, newReviews) => {
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
};

const memberAccountPageThunks: IMemberAccountPageThunks = {
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
      { setState, setNotificationsPage, showMoreNotifications },
      { isListReset },
      { getStoreState }
    ) => {
      const {
        components: { memberAccount },
      } = getStoreState() as IStoreModel;
      const {
        // databaseId: userId,
        notifications: { filter, page },
      } = memberAccount;
      const nextPage = page + 1;

      // const memberNotificationsRequestUrl = new URL(getRestApiUrl(`/wp/v2/notification`));

      // memberNotificationsRequestUrl.search = new URLSearchParams({
      //   filter,
      //   page: `${nextPage}`,
      //   per_page: "5",
      //   author: `${userId}`,
      // }).toString();

      // try {
      //   const memberNotificationsResponse = await fetch(memberNotificationsRequestUrl.toString());
      //   const response: IRestApiResponse = await memberNotificationsResponse.json();

      //   if (response.data?.status && response.data.status !== 200) {
      //     console.error(response.message);
      //   } else if (response instanceof Array && response.length > 0) {
      //     const notificationList: Array<INotification> = response;

      //     setNotificationsPage(nextPage);
      // isListReset
      //   ? setState({
      //     ...memberAccount,
      //     ...{
      //       notifications: {
      //         filter,
      //         page: nextPage,
      //         list: notificationList,
      //       },
      //     },
      //   })
      //   : showMoreNotifications(notificationList);
      //   }
      // } catch (error) {
      //   console.error(error);
      // }

      const notificationList: Array<INotification> = [
        {
          icon: "notification",
          type: "new-message",
          title: [
            {
              link: {
                type: "normal",
                url: "/",
                text: "Новая задача",
              },
            },
            { text: "по тегу" },
            {
              link: {
                type: "normal",
                url: "/",
                text: "WordPress",
              },
            },
            { text: "посмотрим?" },
            {
              link: {
                type: "highlight",
                url: "/",
                text: "Перейти к задаче",
              },
            },
          ],
          time: "3 ч. назад",
        },
        {
          type: "warning-message",
          icon: "notification",
          title: [
            { text: "У вас осталось 2 дня чтобы закрыть задачу" },
            { keyword: "Нужен сайт на Word Press" },
          ],
          time: "2 ч. назад",
        },
        {
          icon: "notification",
          title: [
            { keyword: "Александр Гусев" },
            { text: "прокомментировал задачу" },
            { keyword: "Нужен сайт на Word Press" },
          ],
          time: "3 ч. назад",
        },
        {
          icon: "notification",
          title: [{ text: "Приходите на конференцию 11 апреля, будет круто" }],
          time: "3 ч. назад",
        },
        {
          icon: "notification",
          title: [{ text: "Вы получили награду за" }, { keyword: "10 закрытых задач" }],
          time: "3 ч. назад",
        },
      ];

      setNotificationsPage(nextPage);
      isListReset
        ? setState({
          ...memberAccount,
          ...{
            notifications: {
              filter,
              page: nextPage,
              list: notificationList,
            },
          },
        })
        : showMoreNotifications(notificationList);
    }
  ),
  getMemberNotificationStatsRequest: thunk(
    async ({ setNotificationStats }, params, { getStoreState }) => {
      const {
        components: {
          memberAccount: { databaseId: userId },
        },
      } = getStoreState() as IStoreModel;

      const memberNotificationStatsRequestUrl = new URL(getRestApiUrl(`/wp/v2/notification`));

      memberNotificationStatsRequestUrl.search = new URLSearchParams({
        show_stats: "1",
        author: `${userId}`,
      }).toString();

      // try {
      //   const memberNotificationStatsResponse = await fetch(
      //     memberNotificationStatsRequestUrl.toString()
      //   );
      //   const response: IRestApiResponse & {
      //     project?: number;
      //     info?: number;
      //   } = await memberNotificationStatsResponse.json();

      //   if (response.data?.status && response.data.status !== 200) {
      //     console.error(response.message);
      //   } else if (typeof response.project === "number" && typeof response.info === "number") {
      //     setNotificationStats(response as { project: number; info: number });
      //   }
      // } catch (error) {
      //   console.error(error);
      // }

      setNotificationStats({ project: 3, info: 123 });
    }
  ),
  getMemberTasksRequest: thunk(
    async ({ setTasksPage, showMoreTasks }, params, { getStoreState }) => {
      const {
        components: {
          memberAccount: {
            username,
            tasks: { page },
          },
        },
      } = getStoreState() as IStoreModel;
      const nextPage = page + 1;
      const { request } = await import("graphql-request");
      const { graphqlQuery } = await import("../../model/components/member-account-model");

      try {
        const { memberTasks: taskList } = await request(
          process.env.GraphQLServer,
          graphqlQuery.memberTasks,
          {
            username: username,
            page: nextPage,
          }
        );

        if (taskList.length > 0) {
          setTasksPage(nextPage);
          showMoreTasks(taskList);
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  getMemberTaskStatsRequest: thunk(async ({ setMemberTaskStats }, params, { getStoreState }) => {
    const {
      components: {
        memberAccount: { username: name },
      },
    } = getStoreState() as IStoreModel;

    try {
      const formData = new FormData();
      formData.append("username", String(name));

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
    async ({ setReviewsPage, showMoreReviews }, params, { getStoreState }) => {
      const {
        components: {
          memberAccount: {
            username,
            reviews: { page },
          },
        },
      } = getStoreState() as IStoreModel;
      const nextPage = page + 1;

      try {
        const result = await fetch(
          `${getAjaxUrl("get-member-reviews")}${`&username=${username}&page=${nextPage}`}`
        );

        const { status: responseStatus, message: responseMessage, data: responseData } = await (<
          Promise<{
            status: string;
            message?: string;
            data?: Array<IMemberReview>;
          }>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else if (responseData?.length > 0) {
          setReviewsPage(nextPage);
          showMoreReviews(responseData);
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
