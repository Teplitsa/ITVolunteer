import { action, thunk } from "easy-peasy";
import {
  ITaskListFilterState,
  ITaskListFilterActions,
  ITaskListFilterModel,
  IFetchResult,
} from "../model.typing";
import * as utils from "../../utilities/utilities"
import * as _ from "lodash"

var storeJsLocalStorage = require('store')

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
  initializeState: action((prevState) => {
    Object.assign(prevState, taskListFilterState);
  }),
  setState: action((prevState, newState) => {
    if(newState.filterData) {
      newState = {...newState, isFilterDataLoaded: true}
    }
    Object.assign(prevState, newState);
  }),
  setTipClose: action((state, payload) => {
    state.tipClose = payload ? payload : {}
  }),
  loadTipClose: thunk(async ({setTipClose}) => {
    setTipClose(storeJsLocalStorage.get('taskFilter.tipClose'))
  }),    
  saveTipClose: action((state) => {
      // console.log("save state:", state)
      storeJsLocalStorage.set('taskFilter.tipClose', state.tipClose)
  }),
  setSectionClose: action((state, payload) => {
      state.sectionClose = payload ? payload : {}
      // console.log("set state.setSectionClose:", state.setSectionClose)
  }),
  loadSectionClose: thunk((actions, payload) => {
      actions.setSectionClose(storeJsLocalStorage.get('taskFilter.setSectionClose'))
  }),    
  saveSectionClose: action((state, payload) => {
      // console.log("save state:", state)
      storeJsLocalStorage.set('taskFilter.setSectionClose', state.sectionClose)
  }),
  setOptionCheck: action((state, payload) => {
      state.optionCheck = payload
  }),
  loadOptionCheck: thunk((actions, payload) => {
      let optionCheck = storeJsLocalStorage.get('taskFilter.optionCheck')
      actions.setOptionCheck(_.isEmpty(optionCheck) ? {} : optionCheck)
  }),    
  saveOptionCheck: action((state) => {
      storeJsLocalStorage.set('taskFilter.optionCheck', state.optionCheck)
  }),
  setOptionOpen: action((state, payload) => {
    state.optionOpen = payload
  }),
  loadOptionOpen: thunk((actions, payload) => {
    let optionOpen = storeJsLocalStorage.get('taskFilter.optionOpen')
    actions.setOptionOpen(_.isEmpty(optionOpen) ? {} : optionOpen)
  }),    
  saveOptionOpen: action((state) => {
    storeJsLocalStorage.set('taskFilter.optionOpen', state.optionOpen)
  }),
  setStatusStats: action((state, payload) => {
      state.statusStats = payload
  }),
  setFilterData: action((state, payload) => {
      state.filterData = payload ? payload : []
      state.isFilterDataLoaded = true
      // console.log("set state.filterData:", state.filterData)
  }),
  loadFilterData: thunk((actions, payload) => {
      let action = 'get-task-list-filter'
      fetch(utils.getAjaxUrl(action), {
          method: 'get',
      })
      .then(res => {
          try {
              return res.json()
          } catch(ex) {
              utils.showAjaxError({action, error: ex})
              return {}
          }
      })
      .then(
          (result: IFetchResult) => {
              if(result.status == 'error') {
                  return utils.showAjaxError({message: result.message})
              }

              actions.setFilterData(result.sections)
          },
          (error) => {
              utils.showAjaxError({action, error})
          }
      )
  }),    
};

const taskListFilterModel: ITaskListFilterModel = { ...taskListFilterState, ...taskListFilterActions };

export default taskListFilterModel;
