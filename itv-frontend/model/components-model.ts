import { IComponentsModel, IComponentsState } from "./model.typing";
import honorsPageModel from "./components/honors-model";
import pasekaPageModel from "./components/paseka-model";
import pageModel from "./page-model";
import textPageModel from "./text-page-model";
import taskModel from "./task-model/task-model";
import taskListModel from "./task-model/task-list-model";
import taskListFilterModel from "./task-model/task-list-filter-model";
import userNotifModel from "./user-notif-model";
import { createTaskWizardModel, completeTaskWizardModel } from "./wizard-model";
import createTaskAgreementPageModel from "./components/create-task-agreement-model";
import helpPageModel from "./components/help-model";
import newsItemModel from "./news-model/news-item-model";
import newsListModel from "./news-model/news-list-model";
import otherNewsListModel from "./news-model/other-news-list-model";

const componentsState: IComponentsState = {
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
  page: textPageModel,
  newsList: newsListModel,
  newsItem: newsItemModel,
  otherNewsList: otherNewsListModel,
};

export const componentList = Object.keys(componentsState) as Array<
  keyof IComponentsState
>;

const componentModel: IComponentsModel = {
  ...componentsState,
};

export default componentModel;
