import { action, thunk } from "easy-peasy";
import * as _ from "lodash";
import {
  ITaskListFilterState,
  ITaskListFilterActions,
  ITaskListFilterModel,
} from "../model.typing";
import * as utils from "../../utilities/utilities";

import storeJsLocalStorage from "store";

const taskListFilterState: ITaskListFilterState = {
  optionCheck: null,
  optionOpen: null,
  statusStats: null,
  tipClose: {},
  sectionClose: {},
  filterData: [],
  isFilterDataLoaded: false,
};

export const graphqlQuery = {};

const taskListFilterActions: ITaskListFilterActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, taskListFilterState);
  }),
  setState: action((prevState, newState) => {
    if (newState.filterData) {
      newState = { ...newState, isFilterDataLoaded: true };
    }
    Object.assign(prevState, newState);
  }),
  setTipClose: action((state, payload) => {
    state.tipClose = payload ? payload : {};
  }),
  loadTipClose: thunk(async ({ setTipClose }) => {
    setTipClose(storeJsLocalStorage.get("taskFilter.tipClose"));
  }),
  saveTipClose: action(state => {
    // console.log("save state:", state)
    storeJsLocalStorage.set("taskFilter.tipClose", state.tipClose);
  }),
  setSectionClose: action((state, payload) => {
    state.sectionClose = payload ? payload : {};
    // console.log("set state.setSectionClose:", state.setSectionClose)
  }),
  loadSectionClose: thunk(actions => {
    actions.setSectionClose(storeJsLocalStorage.get("taskFilter.setSectionClose"));
  }),
  saveSectionClose: action(state => {
    // console.log("save state:", state)
    storeJsLocalStorage.set("taskFilter.setSectionClose", state.sectionClose);
  }),
  setOptionCheck: action((state, payload) => {
    state.optionCheck = payload;
  }),
  loadOptionCheck: thunk(actions => {
    const optionCheck = storeJsLocalStorage.get("taskFilter.optionCheck");
    actions.setOptionCheck(_.isEmpty(optionCheck) ? {} : optionCheck);
  }),
  saveOptionCheck: action(state => {
    storeJsLocalStorage.set("taskFilter.optionCheck", state.optionCheck);
  }),
  setOptionOpen: action((state, payload) => {
    state.optionOpen = payload;
  }),
  loadOptionOpen: thunk(actions => {
    const optionOpen = storeJsLocalStorage.get("taskFilter.optionOpen");
    actions.setOptionOpen(_.isEmpty(optionOpen) ? {} : optionOpen);
  }),
  saveOptionOpen: action(state => {
    storeJsLocalStorage.set("taskFilter.optionOpen", state.optionOpen);
  }),
  setStatusStats: action((state, payload) => {
    state.statusStats = payload;
  }),
  setFilterData: action((state, payload) => {
    state.filterData = payload ? payload : [];
    state.isFilterDataLoaded = true;
  }),
  loadFilterData: thunk(async actions => {
    try {
      const { sections } = await (await utils.tokenFetch(`${process.env.BaseUrl}/api/v1/cache/tasks/filter`)).json();

      actions.setFilterData(sections);
    } catch (error) {
      console.error("Failed to fetch the task list filter.");
    }
  }),
};

const taskListFilterModel: ITaskListFilterModel = {
  ...taskListFilterState,
  ...taskListFilterActions,
};

export default taskListFilterModel;
