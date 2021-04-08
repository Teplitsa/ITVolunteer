import {
  IStoreModel,
  IMemberProfilePageModel,
  IMemberProfilePageState,
  IMemberProfilePageActions,
  IMemberProfilePageThunks,
  IFetchResult
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { stripTags, getAjaxUrl } from "../../utilities/utilities";

export const memberProfilePageState: IMemberProfilePageState = {};

const memberProfilePageActions: IMemberProfilePageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, memberProfilePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const memberProfilePageThunks: IMemberProfilePageThunks = {
  updateProfileRequest: thunk(
    async (
      actions,
      { formData, successCallbackFn, errorCallbackFn },
      { getStoreState }
    ) => {
      if (!formData) return;

      const {
        session: { validToken: token },
      } = getStoreState() as IStoreModel;
      const action = "update-profile-v2";

      formData.append("auth_token", String(token));

      try {
        const result = await fetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const {
          status: responseStatus,
          message: responseMessage,
        } = await (<Promise<IFetchResult>>result.json());
        if (responseStatus === "fail") {
          errorCallbackFn && errorCallbackFn(stripTags(responseMessage));
          console.error(stripTags(responseMessage));
        } else {
          successCallbackFn && successCallbackFn(stripTags(responseMessage));
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const memberProfilePageModel: IMemberProfilePageModel = {
  ...memberProfilePageState,
  ...memberProfilePageActions,
  ...memberProfilePageThunks,
};

export default memberProfilePageModel;
