import { IComponentsModel, IComponentsState } from "./model.typing";
import honorsPageModel from "./components/honors-model";
import pasekaPageModel from "./components/paseka-model";
import taskModel from "./task-model/task-model";
import taskListModel from "./task-model/task-list-model";
import taskListFilterModel from "./task-model/task-list-filter-model";
import userNotifModel from "./user-notif-model";
import { createTaskWizardModel, completeTaskWizardModel } from "./wizard-model";
import createTaskAgreementPageModel from "./components/create-task-agreement-model";
import helpPageModel from "./components/help-model";
import memberSecurityPageModel from "./components/member-security-model";
import memberProfilePageModel from "./components/member-profile-model";
import memberAccountPageModel from "./components/member-account-model";
import membersPageModel from "./components/members-model";

const componentsState: IComponentsState = {
  members: membersPageModel,
  memberAccount: memberAccountPageModel,
  memberProfile: memberProfilePageModel,
  memberSecurity: memberSecurityPageModel,
  honors: honorsPageModel,
  paseka: pasekaPageModel,
  task: taskModel,
  taskList: taskListModel,
  taskListFilter: taskListFilterModel,
  userNotif: userNotifModel,
  createTaskWizard: createTaskWizardModel,
  completeTaskWizard: completeTaskWizardModel,
  createTaskAgreement: createTaskAgreementPageModel,
  helpPage: helpPageModel,
};

export const componentList = Object.keys(componentsState) as Array<
  keyof IComponentsState
>;

const componentModel: IComponentsModel = {
  ...componentsState,
};

export default componentModel;
