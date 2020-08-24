import {
  IStoreModel,
  IMemberAccountPageModel,
  IMemberAccountPageState,
  IMemberAccountPageActions,
  IMemberAccountPageThunks,
  IFetchResult,
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { stripTags, getAjaxUrl } from "../../utilities/utilities";

export const memberAccountPageState: IMemberAccountPageState = {
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
  tasks: {
    filter: "open",
    page: 0,
    list: null,
  },
  reviews: null,
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
  setTaskListFilter: action((prevState, newFilter) => {
    prevState.tasks.filter = newFilter;
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
};

const memberAccountPageModel: IMemberAccountPageModel = {
  ...memberAccountPageState,
  ...memberAccountPageActions,
  ...memberAccountPageThunks,
};

export default memberAccountPageModel;
