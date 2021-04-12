import { IComponentsModel, IComponentsState } from "./model.typing";
import honorsPageModel from "./components/honors-model";
import pasekaPageModel from "./components/paseka-model";
import textPageModel from "./text-page-model";
import taskModel from "./task-model/task-model";
import taskListModel from "./task-model/task-list-model";
import taskListFilterModel from "./task-model/task-list-filter-model";
import manageTaskModel from "./task-model/manage-task-model";
import userNotifModel from "./user-notif-model";
import {
  createTaskWizardModel,
  completeTaskWizardModel,
  taskToPortfolioWizardModel,
} from "./wizard-model";
import createTaskAgreementPageModel from "./components/create-task-agreement-model";
import helpPageModel from "./components/help-model";
import newsItemModel from "./news-model/news-item-model";
import newsListModel from "./news-model/news-list-model";
import otherNewsListModel from "./news-model/other-news-list-model";
import portfolioItemModel from "./components/portfolio-item-model";
import portfolioItemFormModel from "./components/portfolio-model";
import memberSecurityPageModel from "./components/member-security-model";
import memberProfilePageModel from "./components/member-profile-model";
import memberAccountPageModel from "./components/member-account-model";
import membersPageModel from "./components/members-model";
import homePageModel from "./components/home-page-model";
import breadCrumbsModel from "./components/breadcrumbs-model";

const componentsState: IComponentsState = {
  members: membersPageModel,
  memberAccount: memberAccountPageModel,
  memberProfile: memberProfilePageModel,
  memberSecurity: memberSecurityPageModel,
  portfolioItem: portfolioItemModel,
  portfolioItemForm: portfolioItemFormModel,
  honors: honorsPageModel,
  paseka: pasekaPageModel,
  task: taskModel,
  taskList: taskListModel,
  taskListFilter: taskListFilterModel,
  manageTask: manageTaskModel,
  userNotif: userNotifModel,
  createTaskWizard: createTaskWizardModel,
  completeTaskWizard: completeTaskWizardModel,
  taskToPortfolioWizard: taskToPortfolioWizardModel,
  createTaskAgreement: createTaskAgreementPageModel,
  helpPage: helpPageModel,
  page: textPageModel,
  newsList: newsListModel,
  newsItem: newsItemModel,
  otherNewsList: otherNewsListModel,
  homePage: homePageModel,
  breadCrumbs: breadCrumbsModel,
};

export const componentList = Object.keys(componentsState) as Array<keyof IComponentsState>;

const componentModel: IComponentsModel = {
  ...componentsState,
};

export default componentModel;
