import { action, thunk } from "easy-peasy";
import {
  IFetchResult,
  IStoreModel,
  IRestApiResponse,
  IManageTaskModel,
  IManageTaskState,
  IManageTaskActions,
  IManageTaskThunks,
  IManageTaskTag,
} from "../model.typing";
import { stripTags, getAjaxUrl, getRestApiUrl } from "../../utilities/utilities";
import * as utils from "../../utilities/utilities";

export const manageTaskState: IManageTaskState = {
  id: 0,
  slug: "",
  informativenessLevel: 0,
  formData: {
    agreement: {
      simpleTask: false,
      socialProblem: false,
      effectiveCooperation: false,
      beInTouch: false,
      personalDataSecurity: false,
    },
    title: "",
    description: "",
    taskTags: {
      value: [],
    },
    ngoTags: {
      index: -1,
      value: "",
    },
    reward: {
      index: -1,
      value: "",
    },
    files: null,
    preferredDuration: "",
    isPasekaChecked: "0",
  },
  tags: null,
  ngoTags: null,
  reward: null,
};

const manageTaskActions: IManageTaskActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, manageTaskState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setInformativenessLevel: action((prevState, newInformativenessLevel) => {
    prevState.informativenessLevel = newInformativenessLevel;
  }),
  setFormData: action((prevState, newFormData) => {
    Object.assign(prevState.formData, newFormData);
  }),
  setTagList: action((prevState, newTags) => {
    prevState.tags = newTags;
  }),
  setNgoTagList: action((prevState, newNgoTags) => {
    prevState.ngoTags = newNgoTags;
  }),
  setRewardList: action((prevState, newReward) => {
    prevState.reward = newReward;
  }),
};

const manageTaskThunks: IManageTaskThunks = {
  loadTags: thunk(async ({ setTagList }) => {
    const requestUrl = new URL(getRestApiUrl("/wp/v2/tags"));

    requestUrl.search = new URLSearchParams([
      ...["id", "name", "parent"].map(param => ["_fields[]", param]),
      ["per_page", String(100)],
    ]).toString();

    try {
      const rawResponse = await utils.tokenFetch(requestUrl.toString());
      const response: IRestApiResponse & Array<IManageTaskTag> = await rawResponse.json();

      if (response.data?.status && response.data.status !== 200) {
        console.error(response.message);
      } else if (response instanceof Array && response.length > 0) {
        const tagList: Array<IManageTaskTag> = response;

        setTagList(tagList);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  loadNgoTags: thunk(async ({ setNgoTagList }) => {
    const requestUrl = new URL(getRestApiUrl("/wp/v2/ngo-tags"));

    requestUrl.search = new URLSearchParams([
      ...["id", "name", "parent"].map(param => ["_fields[]", param]),
      ["per_page", String(100)],
    ]).toString();

    try {
      const rawResponse = await utils.tokenFetch(requestUrl.toString());
      const response: IRestApiResponse & Array<IManageTaskTag> = await rawResponse.json();

      if (response.data?.status && response.data.status !== 200) {
        console.error(response.message);
      } else if (response instanceof Array && response.length > 0) {
        const ngoTagList: Array<IManageTaskTag> = response;

        setNgoTagList(ngoTagList);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  loadReward: thunk(async ({ setRewardList }) => {
    const requestUrl = new URL(getRestApiUrl("/wp/v2/rewards"));

    requestUrl.search = new URLSearchParams([
      ...["id", "name", "parent"].map(param => ["_fields[]", param]),
      ["per_page", String(100)],
    ]).toString();

    try {
      const rawResponse = await utils.tokenFetch(requestUrl.toString());
      const response: IRestApiResponse & Array<IManageTaskTag> = await rawResponse.json();

      if (response.data?.status && response.data.status !== 200) {
        console.error(response.message);
      } else if (response instanceof Array && response.length > 0) {
        const rewardList: Array<IManageTaskTag> = response;

        setRewardList(rewardList);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  submitFormData: thunk(
    async (_, { addSnackbar, setIsFormSubmitted, callback }, { getStoreState }) => {
      const {
        // session: { validToken: token },
        components: {
          manageTask: {
            id,
            slug,
            formData: { agreement, ...formDataWillSubmit },
          },
        },
      } = getStoreState() as IStoreModel;
      const action = "submit-task";
      const submitFormData = new FormData();

      id && slug && submitFormData.append("databaseId", String(id));

      Object.entries(formDataWillSubmit).forEach(([fieldName, fieldData]) => {
        if (fieldName === "files") {
          fieldData &&
            submitFormData.append(
              fieldName,
              fieldData.map((file: { value: number; fileName: string }) => file.value).join(",")
            );
        } else if (Object.prototype.toString.call(fieldData) === "[object Object]") {
          fieldData.value && submitFormData.append(fieldName, fieldData.value);
        } else {
          fieldData && submitFormData.append(fieldName, fieldData);
        }
      });

      // submitFormData.append("auth_token", String(token));

      try {
        const result = await utils.tokenFetch(getAjaxUrl(action), {
          method: "post",
          body: submitFormData,
        });

        const {
          status: responseStatus,
          message: responseMessage,
          taskSlug,
        } = await (<Promise<IFetchResult>>result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
          addSnackbar({
            context: "error",
            text: "При сохранении данных на сервере произошла ошибка.",
          });
        } else {
          setIsFormSubmitted(true);

          callback && callback({ taskSlug });
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const manageTaskModel: IManageTaskModel = {
  ...manageTaskState,
  ...manageTaskActions,
  ...manageTaskThunks,
};

export default manageTaskModel;
