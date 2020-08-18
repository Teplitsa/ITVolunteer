import {
  IMemberSecurityPageModel,
  IMemberSecurityPageState,
  IMemberSecurityPageActions,
} from "../model.typing";
import { action } from "easy-peasy";

export const memberSecurityPageState: IMemberSecurityPageState = {
  login: "",
  email: "",
  newPassword: "",
  newPasswordRepeat: "",
};

const memberSecurityPageActions: IMemberSecurityPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, memberSecurityPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const memberSecurityPageModel: IMemberSecurityPageModel = {
  ...memberSecurityPageState,
  ...memberSecurityPageActions,
};

export default memberSecurityPageModel;
