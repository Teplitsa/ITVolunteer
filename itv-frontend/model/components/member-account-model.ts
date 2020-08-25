import {
  IStoreModel,
  IMemberAccountPageModel,
  IMemberAccountPageState,
  IMemberAccountPageActions,
  IMemberAccountPageThunks,
  IFetchResult,
  IMemberReview,
  IMemberTaskCard,
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { stripTags, getAjaxUrl } from "../../utilities/utilities";

export const memberAccountPageState: IMemberAccountPageState = {
  id: "",
  databaseId: 0,
  cover: "",
  name: "",
  fullName: "",
  itvAvatar: "",
  rating: 0,
  reviewsCount: 0,
  xp: 0,
  organizationLogo: "",
  organizationName: "",
  organizationDescription: "",
  organizationSite: "",
  facebook: "",
  instagram: "",
  vk: "",
  registrationDate: Date.now(),
  thankyouCount: 0,
  tasks: {
    filter: "open",
    page: 0,
    list: null,
  },
  reviews: {
    page: 0,
    list: null,
  },
};

export const graphqlQuery: {
  member: string;
  memberTasks: string;
} = {
  member: `query getMember($username: ID!) {
    user(id: $username, idType: USERNAME) {
      ${Object.keys(memberAccountPageState).filter(
        (key) => !["tasks", "reviews"].includes(key)
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
      tags {
        nodes {
          id
          name
          slug
        }
      }
      rewardTags {
        nodes {
          id
          name
          slug
        }
      }
      ngoTaskTags {
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
  initializeState: action((prevState) => {
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

        const {
          status: responseStatus,
          message: responseMessage,
          imageUrl,
        } = await (<Promise<IFetchResult>>result.json());
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
  uploadUserCoverRequest: thunk(
    async ({ setCover }, { userCover }, { getStoreState }) => {
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

        const {
          status: responseStatus,
          message: responseMessage,
          imageUrl,
        } = await (<Promise<IFetchResult>>result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else {
          setCover(imageUrl);
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  getMemberTasksRequest: thunk(
    async ({ setTasksPage, showMoreTasks }, params, { getStoreState }) => {
      const {
        components: {
          memberAccount: {
            name,
            tasks: { page },
          },
        },
      } = getStoreState() as IStoreModel;
      const nextPage = page + 1;
      const { request } = await import("graphql-request");
      const { graphqlQuery } = await import(
        "../../model/components/member-account-model"
      );

      try {
        const { memberTasks: taskList } = await request(
          process.env.GraphQLServer,
          graphqlQuery.memberTasks,
          {
            username: name,
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
  getMemberReviewsRequest: thunk(
    async ({ setReviewsPage, showMoreReviews }, params, { getStoreState }) => {
      const {
        components: {
          memberAccount: {
            name,
            reviews: { page },
          },
        },
      } = getStoreState() as IStoreModel;
      const nextPage = page + 1;

      try {
        const result = await fetch(
          `${getAjaxUrl(
            "get-member-reviews"
          )}${`&username=${name}&page=${nextPage}`}`
        );

        const {
          status: responseStatus,
          message: responseMessage,
          data: responseData,
        } = await (<
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
  giveThanksRequest: thunk(
    async ({ setThankyouCount }, params, { getStoreState }) => {
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

        const { status: responseStatus, message: responseMessage } = await (<
          Promise<IFetchResult>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else {
          setThankyouCount(thankyouCount + 1);
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const memberAccountPageModel: IMemberAccountPageModel = {
  ...memberAccountPageState,
  ...memberAccountPageActions,
  ...memberAccountPageThunks,
};

export default memberAccountPageModel;