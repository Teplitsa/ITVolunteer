import { action, thunk } from "easy-peasy";
import Cookies from "js-cookie";
import storeJsLocalStorage from "store";
import {
  ITaskListFilterState,
  ITaskListFilterActions,
  ITaskListFilterModel,
} from "../model.typing";
import * as _ from "lodash";

async function loadFilterCheckedOptions() {
  let checkedOptionsFromCookie = Cookies.get("taskFilter.optionCheck");
  // console.log("FRONT checkedOptionsFromCookie:", checkedOptionsFromCookie);

  if(checkedOptionsFromCookie) {
    try {
      checkedOptionsFromCookie = JSON.parse(checkedOptionsFromCookie);
    }
    catch(ex) {
      console.log("parsing taskFilter.optionCheck failed:", ex);
    }
  }

  // TODO: remove in text version, migrated to cookie store for taskFilter.optionCheck
  const checkedOptions = _.isEmpty(checkedOptionsFromCookie) ? await storeJsLocalStorage.get("taskFilter.optionCheck") : checkedOptionsFromCookie;

  // console.log("FRONT checkedOptions ret:", checkedOptions);
  
  return {checkedOptions, checkedOptionsFromCookie};
}

async function storeFilterCheckedOptions(data) {
  if(_.isEmpty(data)) {
    storeJsLocalStorage.remove("taskFilter.optionCheck");
  }
  Cookies.set("taskFilter.optionCheck", JSON.stringify(data), {expires: 365});
}

const taskListFilterState: ITaskListFilterState = {
  optionCheck: null,
  optionOpen: null,
  statusStats: null,
  tipClose: {},
  sectionClose: {},
  filterData: [],
  isFilterDataLoaded: false,
  needReload: false,
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
  loadOptionCheck: thunk(async (actions) => {
    const {checkedOptions, checkedOptionsFromCookie} = await loadFilterCheckedOptions();
    actions.setOptionCheck(_.isEmpty(checkedOptions) ? {} : checkedOptions);

    if(checkedOptionsFromCookie === checkedOptions) {
      // console.log("cookie equals ls");
    }
    else if(!_.isEmpty(checkedOptions)) {
      // console.log("cookie differs from ls and ls not empty");
      actions.saveOptionCheck();
    }
    else {
      // console.log("cookie differs from ls and ls empty");      
    }

  }),
  saveOptionCheck: action(state => {
    state.needReload = true;
    storeFilterCheckedOptions(state.optionCheck);
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
      const { sections } = await (await fetch(`${process.env.BaseUrl}/api/v1/cache/tasks/filter`)).json();

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
