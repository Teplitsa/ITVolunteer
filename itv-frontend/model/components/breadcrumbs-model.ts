import {
  IBreadCrumbsState,
  IBreadCrumbsActions,
  IBreadCrumbsModel
} from "../model.typing";

import { action } from "easy-peasy";

const breadCrumbsState: IBreadCrumbsState = {
  crumbs: [],
};

const breadCrumbsActions: IBreadCrumbsActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, breadCrumbsState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setCrumbs: action((prevState, newCrumbs) => {
    prevState.crumbs = newCrumbs;
  }),
};

const breadCrumbsModel: IBreadCrumbsModel = {
  ...breadCrumbsState,
  ...breadCrumbsActions,
};

export default breadCrumbsModel;
