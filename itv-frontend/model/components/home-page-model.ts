import {
  IHomePageState,
  IHomePageModel,
  IPageActions,
} from "../model.typing";
import { action } from "easy-peasy";
import { withPostType } from "../page-model";

const homePageState: IHomePageState = {
  id: "",
  title: "",
  slug: "",
  content: "",
  newsList: [],
  taskList: [],
};

const homePageActions: IPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, homePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const homePageModel: IHomePageModel = {
  ...homePageState,
  ...homePageActions,
};

export default homePageModel;
