import {
  IMemberAccountPageModel,
  IMemberAccountPageState,
  IMemberAccountPageActions,
} from "../model.typing";
import { action } from "easy-peasy";

export const memberAccountPageState: IMemberAccountPageState = {
  coverImage: "",
  userCard: {
    avatar: "",
    isPasekaMember: false,
    fullName: "",
    status: "",
    calculatedRating: 0,
    reviewCount: 0,
    organization: {
      logo: "",
      name: "",
      description: "",
      site: "",
    },
    contacts: {
      facebook: "",
      twitter: "",
      vk: "",
    },
    registrationDate: "",
  },
};

const memberAccountPageActions: IMemberAccountPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, memberAccountPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const memberAccountPageModel: IMemberAccountPageModel = {
  ...memberAccountPageState,
  ...memberAccountPageActions,
};

export default memberAccountPageModel;
