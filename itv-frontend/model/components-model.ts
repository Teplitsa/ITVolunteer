import { IComponentsModel, IComponentsState } from "./model.typing";
import taskModel from "./task-model/task-model";
import taskListModel from "./task-model/task-list-model";
import { action } from "easy-peasy";

const componentsState: IComponentsState = {
  task: taskModel,
  taskList: taskListModel,
};

export const componentList = Object.keys(componentsState) as Array<
  keyof IComponentsState
>;

const componentModel: IComponentsModel = {
  ...componentsState,
};

export default componentModel;
