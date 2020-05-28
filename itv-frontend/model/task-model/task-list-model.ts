import { action } from "easy-peasy";
import {
  ITaskListModel,
  ITaskListState,
  ITaskListActions,
} from "../model.typing";

const taskListState: ITaskListState = {
  items: [],
  isTaskListLoaded: false,
  optionCheck: null,
  statusStats: null,
};

export const graphqlQuery = {};

const taskListActions: ITaskListActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, taskListState);
  }),
  setState: action((prevState, newState) => {
    if(newState.items) {
      newState = {...newState, isTaskListLoaded: true}
    }
    Object.assign(prevState, newState);
  }),
  resetTaskListLoaded: action((state) => {
    state.isTaskListLoaded = false;
  }),
  appendTaskList: action((state, newItems) => {
    state.items = [...state.items, ...newItems]
  }),
};

const taskListModel: ITaskListModel = { ...taskListState, ...taskListActions };

export default taskListModel;
