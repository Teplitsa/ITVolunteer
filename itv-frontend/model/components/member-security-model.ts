import {
  IMemberSecurityPageModel,
  IMemberSecurityPageState,
  IMemberSecurityPageActions,
  IMemberSecurityPageThunks,
  IStoreModel,
  IFetchResult
} from "../model.typing";
import { action, thunk } from "easy-peasy";
import { stripTags, getAjaxUrl } from "../../utilities/utilities";

export const memberSecurityPageState: IMemberSecurityPageState = {};

const memberSecurityPageActions: IMemberSecurityPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, memberSecurityPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const memberSecurityPageThunks: IMemberSecurityPageThunks = {
  updateUserLoginDataRequest: thunk(
    async (
      actions,
      { formData, successCallbackFn, errorCallbackFn },
      { getStoreState }
    ) => {
      if (!formData) return;

      const {
        session: { validToken: token },
      } = getStoreState() as IStoreModel;
      const action = "update-user-login-data";

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

const memberSecurityPageModel: IMemberSecurityPageModel = {
  ...memberSecurityPageState,
  ...memberSecurityPageActions,
  ...memberSecurityPageThunks
};

export default memberSecurityPageModel;
