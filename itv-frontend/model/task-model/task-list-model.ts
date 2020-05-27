import { action } from "easy-peasy";
import {
  ITaskListModel,
  ITaskListState,
  ITaskListActions,
} from "../model.typing";

const taskListState: ITaskListState = {
  items: [],
};

export const graphqlQuery = {};

const taskListActions: ITaskListActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, taskListState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const taskListModel: ITaskListModel = { ...taskListState, ...taskListActions };

export default taskListModel;
