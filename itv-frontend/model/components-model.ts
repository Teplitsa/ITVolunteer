import { IComponentsModel, IComponentsState } from "./model.typing";
import taskModel from "./task-model/task-model";
import taskListModel from "./task-model/task-list-model";
import taskListFilterModel from "./task-model/task-list-filter-model";
import userNotifModel from "./user-notif-model";
import { action } from "easy-peasy";

const componentsState: IComponentsState = {
  task: taskModel,
  taskList: taskListModel,
  taskListFilter: taskListFilterModel,
  userNotif: userNotifModel,
};

export const componentList = Object.keys(componentsState) as Array<
  keyof IComponentsState
>;

const componentModel: IComponentsModel = {
  ...componentsState,
};

export default componentModel;
