import {
  IMemberProfilePageModel,
  IMemberProfilePageState,
  IMemberProfilePageActions,
} from "../model.typing";
import { action } from "easy-peasy";

export const memberProfilePageState: IMemberProfilePageState = {
  user: {
    name: "",
    surname: "",
    contacts: {
      skype: "",
      twitter: "",
      facebook: "",
      vk: "",
    },
  },
  organization: {
    name: "",
    description: "",
    site: "",
  },
};

const memberProfilePageActions: IMemberProfilePageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, memberProfilePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const memberProfilePageModel: IMemberProfilePageModel = {
  ...memberProfilePageState,
  ...memberProfilePageActions,
};

export default memberProfilePageModel;
