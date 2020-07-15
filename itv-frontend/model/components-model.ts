import { IComponentsModel, IComponentsState } from "./model.typing";
import honorsPageModel from "./components/honors-model";
import pasekaPageModel from "./components/paseka-model";
import taskModel from "./task-model/task-model";
import taskListModel from "./task-model/task-list-model";
import taskListFilterModel from "./task-model/task-list-filter-model";
import userNotifModel from "./user-notif-model";
import { createTaskWizardModel, completeTaskWizardModel } from "./wizard-model";

const componentsState: IComponentsState = {
  honors: honorsPageModel,
  paseka: pasekaPageModel,
  task: taskModel,
  taskList: taskListModel,
  taskListFilter: taskListFilterModel,
  userNotif: userNotifModel,
  createTaskWizard: createTaskWizardModel,
  completeTaskWizard: completeTaskWizardModel,
};

export const componentList = Object.keys(componentsState) as Array<
  keyof IComponentsState
>;

const componentModel: IComponentsModel = {
  ...componentsState,
};

export default componentModel;
