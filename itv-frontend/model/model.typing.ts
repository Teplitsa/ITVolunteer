/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction } from "react";
import { Action, ActionOn, Thunk, ThunkOn, Computed } from "easy-peasy";
import { ISnackbarMessage } from "../context/global-scripts";
import {
  ICoreHeadingBlock,
  ICoreParagraphBlock,
  ICoreMediaTextBlock,
} from "./gutenberg/gutenberg.typing";

/**
 * Model helpers
 */

export interface IModelWithAppAndEntrypoint extends IComponentsState {
  app: IAppState;
  entrypointType: PostType;
  entrypoint: IStoreEntrypoint;
}

/**
 * Store
 */

export interface IStoreModel {
  app: IAppState;
  session: ISessionModel;
  entrypoint: IStoreEntrypoint;
  components: IComponentsState;
}

export interface IStoreEntrypoint {
  archive?: IArchiveState;
  page?: IPageState;
}

/**
 * App
 */

export interface IAppModel extends IAppState, IAppActions {}

export interface IAppState {
  menus: IAppMenu;
  entrypointTemplate?: keyof IStoreEntrypoint;
  componentsLoaded?: IAppComponentsLoaded;
}

export interface IAppComponentsLoaded {
  [index: string]: Array<{ at: string; entrypoint: string }>;
}

export interface IAppMenu {
  social: Array<IAppMenuItem>;
}

export interface IAppMenuItem {
  id: string;
  url: string;
  label: string;
}

export interface IAppActions {
  setState: Action<IAppModel, IAppState>;
}

/**
 * Session
 */

export interface ISessionModel extends ISessionState, ISessionActions, ISessionThunks {}

export interface ISessionState {
  isLoaded: boolean;
  token: ISessionToken;
  user: ISessionUser;
  validToken?: Computed<ISessionModel, string>;
  isLoggedIn?: Computed<ISessionModel, boolean>;
  isAdmin?: Computed<ISessionModel, boolean>;
  isTaskAuthorLoggedIn?: Computed<ISessionModel, boolean, IStoreModel>;
  isUserTaskCandidate?: Computed<ISessionModel, boolean, IStoreModel>;
  canUserReplyToComment?: Computed<ISessionModel, boolean, IStoreModel>;
  isAccountOwner?: Computed<ISessionModel, boolean, IStoreModel>;
}

export interface ISessionToken {
  timestamp: number;
  authToken: string;
  refreshToken: string;
}

export interface ISessionUser {
  id: string;
  databaseId: number;
  username: string;
  slug: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  profileURL: string;
  memberRole: string;
  itvAvatar: string;
  itvAvatarFile: any;
  cover: string;
  coverFile: any;
  authorReviewsCount: number;
  solvedTasksCount: number;
  doerReviewsCount: number;
  isPasekaMember: boolean;
  isPartner: boolean;
  organizationName: string;
  organizationLogo: string;
  organizationLogoFile: any;
  organizationDescription: string;
  organizationSite: string;
  xp: number;
  phone?: string;
  skype: string;
  twitter: string;
  telegram?: string;
  facebook: string;
  vk: string;
  instagram: string;
  subscribeTaskList?: any | null;
  logoutUrl?: string;
  isAdmin?: boolean;
  itvRole: "author" | "doer";
}

export interface ISessionActions {
  setState: Action<ISessionModel, ISessionState>;
  setIsLoaded: Action<ISessionState, boolean>;
  setUserItvRole: Action<ISessionState, "author" | "doer">;
  setSubscribeTaskList: Action<ISessionState, any>;
  loadSubscribeTaskList: Thunk<ISessionActions>;
  onMemberAccountTemplateChange: ActionOn<ISessionModel, IStoreModel>;
  setUserAvatar: Action<ISessionState, any>;
  setUserAvatarFile: Action<ISessionState, any>;
  setUserCover: Action<ISessionState, any>;
  setUserCoverFile: Action<ISessionState, any>;
}

export interface ISessionThunks {
  login: Thunk<ISessionActions, { username: string; password: string }>;
  register: Thunk<
    ISessionActions,
    {
      formData: any;
      successCallbackFn: (message: string) => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  userLogin: Thunk<
    ISessionActions,
    {
      formData: any;
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  resetPassword: Thunk<
    ISessionActions,
    {
      userLogin: string;
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  changePassword: Thunk<
    ISessionActions,
    {
      newPassword: string;
      key: string;
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    }
  >;
  setRole: Thunk<
    ISessionActions,
    {
      itvRole: "author" | "doer";
      successCallbackFn: () => void;
      errorCallbackFn: (message: string) => void;
    },
    IStoreModel
  >;
}

/**
 * Archive
 */

export interface IArchiveModel extends IArchiveState, IArchiveActions {}

export interface IArchiveState {
  entrypoint: string;
  hasNextPage: boolean;
  lastViewedListItem: string | null;
  postType?: PostTypeWithArchive;
  seo?: IPageSEO;
}

export interface IArchiveActions {
  initializeState: Action<IArchiveModel>;
  setState: Action<IArchiveModel, IArchiveState>;
  onLoadMoreTasksRequestSuccess: ThunkOn<IArchiveModel, any, IStoreModel>;
}

/**
 * Page
 */

export type PostTypeWithArchive = "post" | "task";

export type PostType = "page" | PostTypeWithArchive;

export interface IPageModel extends IPageState, IPageActions {}

export interface IPageState {
  slug: string;
  title?: string;
  content?: string;
  featuredImage?: any;
  dateGmt?: string;
  date?: string;
  seo?: IPageSEO;
}

export interface IPageSEO {
  canonical: string;
  title: string;
  metaDesc?: string;
  focuskw?: string;
  metaRobotsNoindex: string;
  metaRobotsNofollow: string;
  opengraphAuthor?: string;
  opengraphDescription?: string;
  opengraphTitle?: string;
  opengraphImage?: {
    sourceUrl: string;
    srcSet?: string;
    altText?: string;
  };
  opengraphUrl?: string;
  opengraphSiteName?: string;
  opengraphPublishedTime?: string;
  opengraphModifiedTime?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: {
    sourceUrl: string;
    srcSet?: string;
    altText?: string;
  };
}

export interface IPageSEOMeta {
  keywords?: string;
  description?: string;
}

export interface IPageActions {
  initializeState: Action<IPageModel>;
  setState: Action<IPageModel, IPageState>;
}

/**
 * Components
 */

export type IComponentsModel = IComponentsState;

export interface IComponentsState {
  members?: IMembersPageModel;
  memberAccount?: IMemberAccountPageModel;
  memberProfile?: IMemberProfilePageModel;
  memberSecurity?: IMemberSecurityPageModel;
  portfolioItem?: IPortfolioItemModel;
  portfolioItemForm?: IPortfolioItemFormModel;
  honors?: IHonorsPageModel;
  paseka?: IPasekaPageModel;
  task?: ITaskModel;
  taskList?: ITaskListModel;
  taskListFilter?: ITaskListFilterModel;
  userNotif?: IUserNotifModel;
  createTaskWizard?: ICreateTaskWizardModel;
  completeTaskWizard?: ICompleteTaskWizardModel;
  taskToPortfolioWizard?: ITaskToPortfolioWizardModel;
  createTaskAgreement?: ICreateTaskAgreementPageModel;
  helpPage?: IHelpPageModel;
  page?: IPageModel;
  newsList?: INewsListModel;
  newsItem?: INewsItemModel;
  otherNewsList?: IOtherNewsListModel;
  homePage?: IHomePageModel;
}

/**
 * Members
 */

export interface IMembersPageModel
  extends IMembersPageState,
    IMembersPageActions,
    IMembersPageThunks {}

export interface IMemberListItem {
  id: string;
  itvAvatar: string;
  fullName: string;
  username: string;
  memberRole: string;
  organizationName: string;
  organizationDescription: string;
  rating: number;
  reviewsCount: number;
  xp: number;
  solvedProblems: number;
  facebook: string;
  instagram: string;
  vk: string;
  organizationSite: string;
  registrationDate: number;
}

export interface IMembersPageState {
  paged: number;
  userListStats: {
    total: number;
  };
  userList: Array<IMemberListItem>;
}

export interface IMembersPageActions {
  initializeState: Action<IMembersPageModel>;
  setState: Action<IMembersPageModel, IMembersPageState>;
  setPaged: Action<IMembersPageModel, number>;
  setUserListStats: Action<
    IMembersPageModel,
    {
      total: number;
    }
  >;
  addMoreVolunteers: Action<IMembersPageModel, Array<IMemberListItem>>;
}

export interface IMembersPageThunks {
  moreVolunteersRequest: Thunk<
    IMembersPageActions,
    { setLoading: Dispatch<SetStateAction<boolean>> }
  >;
}

/**
 * Member Account
 */

export type MemberAccountTemplate = "volunteer" | "author";

export interface IMemberAccountPageModel
  extends IMemberAccountPageState,
    IMemberAccountPageActions,
    IMemberAccountPageThunks {}

export interface IMemberTaskCard {
  id: string;
  slug: string;
  status: "open" | "closed" | "draft" | "in_work" | "publish";
  title: string;
  content: string;
  author: ITaskCommentAuthor;
  dateGmt: string;
  deadline: string;
  doerCandidatesCount: number;
  viewsCount: number;
  isApproved: boolean;
  pemalinkPath: string;
  tags?: {
    nodes: Array<ITaskTag>;
  };
  rewardTags?: {
    nodes: Array<ITaskTag>;
  };
  ngoTaskTags?: {
    nodes: Array<ITaskTag>;
  };
}

export interface IMemberReview {
  id: string;
  author_id: string;
  doer_id: string;
  author?: ISessionUser;
  doer?: ISessionUser;
  task_id: string;
  task?: ITaskState;
  message: string;
  rating: number;
  communication_rating: number;
  time_add: string;
  type: "as_author" | "as_doer";
}

export interface IMemberAccountPageState {
  id: string;
  databaseId: number;
  slug: "";
  isHybrid: boolean;
  template: MemberAccountTemplate;
  cover?: string;
  coverFile?: any;
  name: string;
  username: string;
  fullName: string;
  itvAvatar?: string;
  itvAvatarFile?: any;
  rating?: number;
  reviewsCount?: number;
  xp?: number;
  organizationLogo?: string;
  organizationName?: string;
  organizationDescription?: string;
  organizationSite?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  twitter?: string;
  vk?: string;
  skype?: string;
  telegram?: string;
  isEmptyProfile?: boolean;
  registrationDate: number;
  thankyouCount: number;
  notificationStats: {
    project: number;
    info: number;
  };
  taskStats: {
    closed: number;
    draft: number;
    in_work: number;
    publish: number;
    open?: number;
  };
  tasks?: {
    filter: "open" | "closed" | "draft";
    page: number;
    list: Array<IMemberTaskCard>;
  };
  reviews?: {
    page: number;
    list: Array<IMemberReview>;
  };
  portfolio?: {
    page: number;
    list: Array<IPortfolioItemFormState>;
  };
  notifications?: {
    filter: "all" | "project" | "info";
    page: number;
    list: Array<INotification>;
  };
  profileFillStatus?: {
    createdTasksCount: number;
    approvedAsDoerTasksCount: number;
    isCoverExist: boolean;
    isAvatarExist: boolean;
    isProfileInfoEnough: boolean;
  };
  isNeedAttentionPanelClosed?: boolean;
}

export interface IMemberAccountPageActions {
  initializeState: Action<IMemberAccountPageModel>;
  setState: Action<IMemberAccountPageModel, IMemberAccountPageState>;
  setTemplate: Action<IMemberAccountPageModel, { template: MemberAccountTemplate }>;
  setAvatar: Action<IMemberAccountPageModel, string>;
  setCover: Action<IMemberAccountPageModel, string>;
  setThankyouCount: Action<IMemberAccountPageModel, number>;
  setTaskListFilter: Action<IMemberAccountPageModel, "open" | "closed" | "draft">;
  setPortfolioPage: Action<IMemberAccountPageModel, number>;
  showMorePortfolio: Action<IMemberAccountPageModel, Array<IPortfolioItemFormState>>;
  setNotificationStats: Action<
    IMemberAccountPageModel,
    {
      project: number;
      info: number;
    }
  >;
  setNotifications: Action<
    IMemberAccountPageModel,
    {
      filter: "all" | "project" | "info";
      page: number;
      list: Array<INotification>;
    }
  >;
  setNotificationListFilter: Action<IMemberAccountPageModel, "all" | "project" | "info">;
  setNotificationsPage: Action<IMemberAccountPageModel, number>;
  showMoreNotifications: Action<IMemberAccountPageModel, Array<INotification>>;
  setTasksPage: Action<IMemberAccountPageModel, number>;
  showMoreTasks: Action<IMemberAccountPageModel, Array<IMemberTaskCard>>;
  setReviewsPage: Action<IMemberAccountPageModel, number>;
  showMoreReviews: Action<IMemberAccountPageModel, Array<IMemberReview>>;
  setMemberTaskStats: Action<IMemberAccountPageModel, any>;
  setMemeberProfileFillStatus: Action<IMemberAccountPageModel, any>;
  setIsNeedAttentionPanelClosed: Action<IMemberAccountPageModel, boolean>;
  setTaskList: Action<IMemberAccountPageModel, Array<IMemberTaskCard>>;
  setReviews: Action<IMemberAccountPageModel, any>;
  setAvatarFile: Action<IMemberAccountPageModel, any>;
  setCoverFile: Action<IMemberAccountPageModel, any>;
}

export interface IMemberAccountPageThunks {
  uploadUserAvatarRequest: Thunk<
    IMemberAccountPageActions,
    {
      userAvatar: File;
      fileName: string;
    }
  >;
  uploadUserCoverRequest: Thunk<
    IMemberAccountPageActions,
    {
      userCover: File;
    }
  >;
  getMemberPortfolioRequest: Thunk<IMemberAccountPageActions>;
  getMemberTasksRequest: Thunk<
    IMemberAccountPageActions,
    { customPage?: number; isTaskListReset?: boolean }
  >;
  getMemberReviewsRequest: Thunk<
    IMemberAccountPageActions,
    { customPage?: number; isReviewListReset?: boolean }
  >;
  getMemberTaskStatsRequest: Thunk<IMemberAccountPageActions>;
  getMemberNotificationsRequest: Thunk<IMemberAccountPageActions, { isListReset: boolean }>;
  getMemberNotificationStatsRequest: Thunk<IMemberAccountPageActions>;
  giveThanksRequest: Thunk<IMemberAccountPageActions>;
  profileFillStatusRequest: Thunk<IMemberAccountPageActions>;
  loadIsNeedAttentionPanelClosed: Thunk<IMemberAccountPageActions>;
  storeIsNeedAttentionPanelClosed: Thunk<IMemberAccountPageActions>;
  changeItvRoleRequest: Thunk<IMemberAccountPageActions, { itvRole: "doer" | "author" }>;
}

/**
 * Member Profile
 */

export interface IMemberProfilePageModel
  extends IMemberProfilePageState,
    IMemberProfilePageActions,
    IMemberProfilePageThunks {}

export interface IMemberProfilePageState {}

export interface IMemberProfilePageActions {
  initializeState: Action<IMemberProfilePageModel>;
  setState: Action<IMemberProfilePageModel, IMemberProfilePageState>;
}

export interface IMemberProfilePageThunks {
  updateProfileRequest: Thunk<
    IMemberProfilePageActions,
    {
      formData: FormData;
      successCallbackFn?: (message: string) => void;
      errorCallbackFn?: (message: string) => void;
    }
  >;
}

/**
 * Member Security
 */

export interface IMemberSecurityPageModel
  extends IMemberSecurityPageState,
    IMemberSecurityPageActions,
    IMemberSecurityPageThunks {}

export interface IMemberSecurityPageState {}

export interface IMemberSecurityPageActions {
  initializeState: Action<IMemberSecurityPageModel>;
  setState: Action<IMemberSecurityPageModel, IMemberSecurityPageState>;
}

export interface IMemberSecurityPageThunks {
  updateUserLoginDataRequest: Thunk<
    IMemberSecurityPageActions,
    {
      formData: FormData;
      successCallbackFn?: (message: string, isMustRelogin: boolean) => void;
      errorCallbackFn?: (message: string, isMustRelogin: boolean) => void;
    }
  >;
}

/**
 * Portfolio item
 */

export interface IPortfolioItemModel
  extends IPortfolioItemState,
    IPortfolioItemActions,
    IPortfolioItemThunks {}

export interface IPortfolioItemAuthor {
  id: number;
  slug: string;
  name: string;
  fullName: string;
  itvAvatar: string;
  authorReviewsCount: number;
  doerReviewsCount: number;
  reviewsCount: number;
  rating: number;
  xp: number;
  itvRole: "author" | "doer";
  itvRoleTitle: "Заказчик" | "Волонтер";
}

export interface IPortfolioItemState {
  author: IPortfolioItemAuthor;
  item: IPortfolioItemFormState;
}

export interface IPortfolioItemActions {
  initializeState: Action<IPortfolioItemModel>;
  setState: Action<IPortfolioItemModel, IPortfolioItemState>;
}

export interface IPortfolioItemThunks {
  deletePortfolioItemRequest: Thunk<
    IPortfolioItemFormActions,
    {
      successCallbackFn?: () => void;
      errorCallbackFn?: () => void;
    }
  >;
}

/**
 * Portfolio item form
 */

export interface IPortfolioItemFormProps {
  title?: string;
  description?: string;
  preview?: number;
  fullImage?: number;
  submitBtnTitle: React.FunctionComponent;
  afterSubmitHandler: (portfolioItemData: FormData) => void;
}

export interface IPortfolioItemFormModel
  extends IPortfolioItemFormState,
    IPortfolioItemFormActions,
    IPortfolioItemFormThunks {}

export interface IPortfolioItemFormState {
  id: number;
  slug: string;
  title: string;
  description: string;
  workDetails?: string;
  resultLink?: string;
  preview: number;
  fullImage: number;
  nextPortfolioItemSlug?: string;
  prevPortfolioItemSlug?: string;
}

export interface IPortfolioItemFormActions {
  initializeState: Action<IPortfolioItemFormModel>;
  setState: Action<IPortfolioItemFormModel, IPortfolioItemFormState>;
}

export interface IPortfolioItemFormThunks {
  publishPortfolioItemRequest: Thunk<
    IPortfolioItemFormActions,
    {
      inputData: FormData;
      successCallbackFn?: () => void;
      errorCallbackFn?: () => void;
    }
  >;
  updatePortfolioItemRequest: Thunk<
    IPortfolioItemFormActions,
    {
      slug: string;
      inputData: FormData;
      successCallbackFn?: () => void;
      errorCallbackFn?: () => void;
    }
  >;
}

/**
 * Paseka
 */

export interface IPasekaPageModel extends IPasekaPageState, IPasekaPageActions {}

export interface IPasekaPageState {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
}

export interface IPasekaPageActions {
  initializeState: Action<IPasekaPageModel>;
  setState: Action<IPasekaPageModel, IPasekaPageState>;
}

/**
 * Honors
 */

export interface IHonorsPageModel extends IHonorsPageState, IHonorsPageActions {}

export interface IHonorsPageState {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  blocks?: Array<ICoreHeadingBlock | ICoreParagraphBlock | ICoreMediaTextBlock>;
}

export interface IHonorsPageActions {
  initializeState: Action<IHonorsPageModel>;
  setState: Action<IHonorsPageModel, IHonorsPageState>;
}

/**
 * Create task agreement
 */

export interface ICreateTaskAgreementPageModel
  extends ICreateTaskAgreementPageState,
    IHonorsPageActions {}

export interface ICreateTaskAgreementPageState {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  blocks?: Array<ICoreHeadingBlock | ICoreParagraphBlock | ICoreMediaTextBlock>;
}

export interface ICreateTaskAgreementPageActions {
  initializeState: Action<ICreateTaskAgreementPageModel>;
  setState: Action<ICreateTaskAgreementPageModel, ICreateTaskAgreementPageState>;
}

/**
 * Task
 */

export type TaskStatus = "draft" | "publish" | "in_work" | "closed" | "archived";

export interface ITaskModel extends ITaskState, ITaskActions, ITaskThunks {}

export interface ITaskState {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  date: string;
  dateGmt: string;
  deadline: string;
  viewsCount: number;
  doerCandidatesCount: number;
  status?: TaskStatus;
  reviewsDone: boolean;
  nextTaskSlug: string;
  approvedDoer?: ITaskApprovedDoer;
  author?: ITaskAuthor;
  doers?: Array<ITaskDoer>;
  comments?: Array<ITaskComment>;
  timeline?: Array<ITaskTimelineItem>;
  reviews?: {
    reviewForAuthor?: ITaskReviewer;
    reviewForDoer?: ITaskReviewer;
  };
  isApproved: boolean;
  pemalinkPath: string;
  nonceContactForm?: string;
  hasCloseSuggestion?: Computed<ITaskModel>;
  tags?: {
    nodes: Array<ITaskTag>;
  };
  rewardTags?: {
    nodes: Array<ITaskTag>;
  };
  ngoTaskTags?: {
    nodes: Array<ITaskTag>;
  };
  featuredImage?: {
    sourceUrl: string;
  };
  result: string;
  resultHtml: string;
  impact: string;
  impactHtml: string;
  contentHtml: string;
  references: string;
  referencesHtml: string;
  referencesList: Array<string>;
  externalFileLinks: string;
  externalFileLinksList: Array<string>;
  preferredDoers: string;
  preferredDuration: string;
  cover: any;
  coverImgSrcLong: string;
  files: Array<any>;
}

export interface ITaskReviewer {
  id: string;
  author_id: string;
  doer_id: string;
  task_id: string;
  message: string;
  rating: string;
  time_add: string;
}

export interface ITaskApprovedDoer {
  id: string;
  databaseId: number;
  fullName: string;
  slug: string;
  itvAvatar: string;
  profileURL: string;
  solvedTasksCount: number;
  doerReviewsCount: number;
  isPasekaMember: boolean;
}

export interface ITaskAuthor {
  id: string;
  databaseId: number;
  fullName: string;
  itvAvatar: string;
  profileURL: string;
  authorReviewsCount: number;
  doerReviewsCount: number;
  organizationName: string;
  organizationDescription: string;
  organizationLogo: string;
  isPartner: boolean;
  memberRole: string;
  facebook: string;
  instagram: string;
  vk: string;
  registrationDate: number;
}

export interface ITaskDoer {
  id: string;
  databaseId: number;
  fullName: string;
  slug: string;
  profileURL: string;
  itvAvatar: string;
  solvedTasksCount: number;
  doerReviewsCount: number;
  isPasekaMember: boolean;
}

export interface ITaskComment {
  id: string;
  content: string;
  date: string;
  dateGmt?: string;
  likesCount: number;
  likeGiven: boolean;
  likers: Array<ITaskCommentLiker>;
  author: ITaskCommentAuthor;
  replies?: { nodes: Array<ITaskComment> };
}

export interface ITaskCommentLiker {
  userId: string;
  userName: string;
  userFullName: string;
}

export interface ITaskCommentAuthor {
  id: string;
  slug?: string;
  fullName: string;
  itvAvatar: string;
  memberRole?: string;
  profileURL?: string;
}

export interface ITaskTimelineItem {
  id: number;
  doer_id?: string;
  task_id: string;
  type: string;
  status: string;
  sort_order: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  message?: string;
  date_close?: string;
  decision: string;
  title: string;
  isOverdue: boolean;
  timeline_date: string;
  doer?: ITaskTimelineItemDoer;
  taskHasCloseSuggestion?: boolean;
}

export interface ITaskTimelineItemDoer {
  id: string;
  fullName: string;
  memberRole: string;
  slug: string;
  itvAvatar: string;
  authorReviewsCount: string;
  solvedTasksCount: string;
  doerReviewsCount: string;
  isPartner: string;
  isPasekaMember: boolean;
  organizationName: string;
  organizationDescription: string;
  organizationLogo: string;
  pemalinkUrl: string;
}

export interface ITaskTag {
  id: string;
  name: string;
  slug: string;
}

export interface ITaskActions {
  initializeState: Action<ITaskModel>;
  setState: Action<ITaskModel, ITaskState>;
  updateStatus: Action<ITaskModel, { status: TaskStatus }>;
  updateModerationStatus: Action<ITaskModel, { isApproved: boolean }>;
  updateApprovedDoer: Action<ITaskModel, ITaskApprovedDoer>;
  declineApprovedDoer: Action<ITaskModel>;
  updateDoers: Action<ITaskModel, Array<ITaskDoer>>;
  updateComments: Action<ITaskModel, Array<ITaskComment>>;
  updateTimeline: Action<ITaskModel, Array<ITaskTimelineItem>>;
  updateReviews: Action<
    ITaskModel,
    {
      reviewForAuthor?: ITaskReviewer;
      reviewForDoer?: ITaskReviewer;
    }
  >;
  likeComment: Action<
    ITaskModel,
    {
      commentId: string;
      likesCount: number;
      likers: Array<ITaskCommentLiker>;
    }
  >;
  unlikeComment: Action<
    ITaskModel,
    {
      commentId: string;
      likesCount: number;
      likers: Array<ITaskCommentLiker>;
    }
  >;
}

export interface ITaskThunks {
  taskRequest: Thunk<ITaskActions>;
  manageDoerRequest: Thunk<
    ITaskActions,
    {
      action: "approve-candidate" | "decline-candidate";
      doer: ITaskDoer;
      callbackFn?: () => void;
    }
  >;
  statusChangeRequest: Thunk<ITaskActions, { status: TaskStatus; callbackFn?: () => void }>;
  moderateRequest: Thunk<
    ITaskActions,
    {
      action: "approve-task" | "decline-task";
      taskId: string;
      callbackFn?: () => void;
    }
  >;
  doersRequest: Thunk<ITaskActions>;
  addDoerRequest: Thunk<ITaskActions>;
  commentsRequest: Thunk<ITaskActions>;
  commentLikeRequest: Thunk<ITaskActions, string>;
  commentUnlikeRequest: Thunk<ITaskActions, string>;
  newCommentRequest: Thunk<
    ITaskActions,
    {
      commentBody: string;
      parentCommentId?: string;
      callbackFn?: () => void;
    }
  >;
  onNewCommentRequestSuccess: ThunkOn<ITaskModel>;
  timelineRequest: Thunk<ITaskActions>;
  reviewsRequest: Thunk<ITaskActions>;
  newReviewRequest: Thunk<
    ITaskActions,
    {
      reviewRating: number;
      reviewText: string;
      callbackFn?: () => void;
    }
  >;
  onNewReviewRequestSuccess: ThunkOn<ITaskModel>;
  acceptSuggestedDateRequest: Thunk<
    ITaskActions,
    {
      timelineItemId: string;
    }
  >;
  onAcceptSuggestedDateRequest: ThunkOn<ITaskModel>;
  rejectSuggestedDateRequest: Thunk<
    ITaskActions,
    {
      timelineItemId: string;
    }
  >;
  onRejectSuggestedDateRequest: ThunkOn<ITaskModel>;
  acceptSuggestedCloseRequest: Thunk<
    ITaskActions,
    {
      timelineItemId: string;
    }
  >;
  onAcceptSuggestedCloseRequest: ThunkOn<ITaskModel>;
  onAcceptSuggestedCloseRequestUpdateTimeline: ThunkOn<ITaskModel>;
  rejectSuggestedCloseRequest: Thunk<
    ITaskActions,
    {
      timelineItemId: string;
    }
  >;
  onRejectSuggestedCloseRequest: ThunkOn<ITaskModel>;
  suggestCloseDateRequest: Thunk<
    ITaskActions,
    {
      suggestComment: string;
      suggestedCloseDate: Date | null;
      callbackFn?: () => void;
    }
  >;
  onSuggestCloseDateRequest: ThunkOn<ITaskModel>;
  suggestCloseTaskRequest: Thunk<
    ITaskActions,
    {
      suggestComment?: string;
      callbackFn?: () => void;
    }
  >;
  onSuggestCloseTaskRequest: ThunkOn<ITaskModel>;
  adminSupportRequest: Thunk<
    ITaskActions,
    {
      messageText: string;
      email?: string;
      addSnackbar: (message: ISnackbarMessage) => void;
      callbackFn?: () => void;
    }
  >;
}

/**
 * TaskList
 */

export interface ITaskListModel extends ITaskListState, ITaskListActions, ITaskListThunks {}

export interface ITaskListState {
  items: Array<ITaskListItemState>;
  isTaskListLoaded: boolean;
}

export interface ITaskListActions {
  initializeState: Action<ITaskListModel>;
  setState: Action<ITaskListModel, ITaskListState>;
  resetTaskListLoaded: Action<ITaskListModel>;
  appendTaskList: Action<ITaskListModel, Array<ITaskListItemState>>;
  setTaskList: Action<ITaskListModel, Array<ITaskListItemState>>;
}

export interface ITaskListThunks {
  loadMoreTasksRequest: Thunk<ITaskListActions, { searchPhrase: string }>;
  onLoadMoreTasksRequestSuccess: ThunkOn<ITaskListModel>;
}

/**
 * TaskListItem
 */

export type ITaskListItemModel = ITaskListItemState;

export interface ITaskListItemState {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  dateGmt: string;
  deadline?: string;
  viewsCount: number;
  doerCandidatesCount: number;
  status?: TaskStatus;
  reviewsDone: boolean;
  nextTaskSlug: string;
  approvedDoer?: ITaskApprovedDoer;
  author?: ITaskAuthor;
  cover: any;
  coverImgSrcLong: string;
  files: Array<any>;
  [x: string]: any;
}

/**
 * TaskListFilter
 */

export interface ITaskListFilterModel extends ITaskListFilterState, ITaskListFilterActions {}
export interface ITaskListFilterState {
  optionCheck;
  optionOpen;
  statusStats;
  tipClose: any;
  sectionClose;
  filterData;
  isFilterDataLoaded;
}

export interface ITaskListFilterActions {
  initializeState: Action<ITaskListFilterModel>;
  setState: Action<ITaskListFilterModel, ITaskListFilterState>;
  setTipClose: Action<ITaskListFilterModel, any>;
  saveTipClose: Action<ITaskListFilterState>;
  loadTipClose: Thunk<ITaskListFilterActions>;
  setSectionClose: Action<ITaskListFilterState, any>;
  saveSectionClose: Action<ITaskListFilterState, any>;
  loadSectionClose: Thunk<ITaskListFilterActions, any>;
  setOptionCheck: Action<ITaskListFilterState, any>;
  saveOptionCheck: Action<ITaskListFilterState>;
  loadOptionCheck: Thunk<ITaskListFilterActions, any>;
  setOptionOpen: Action<ITaskListFilterState, any>;
  saveOptionOpen: Action<ITaskListFilterState>;
  loadOptionOpen: Thunk<ITaskListFilterActions, any>;
  loadFilterData: Thunk<ITaskListFilterActions, any>;
  setStatusStats: Action<ITaskListFilterState, any>;
  setFilterData: Action<ITaskListFilterState, any>;
}

/**
 * UserNotif
 */

export interface IUserNotifModel extends IUserNotifState, IUserNotifActions {}
export interface IUserNotifState {
  notifList;
}

export interface IUserNotifItem {
  id;
  [x: string]: any;
}

export interface IUserNotifActions {
  initializeState: Action<ITaskListFilterModel>;
  setState: Action<IUserNotifModel, IUserNotifState>;
  setNotifList: Action<IUserNotifModel, Array<any>>;
  prependNotifList: Action<IUserNotifModel, Array<any>>;
  loadNotifList: Thunk<IUserNotifActions>;
  loadFreshNotifList: Thunk<IUserNotifActions>;
  removeNotifFromList: Action<IUserNotifModel, any>;
}

/**
 * Notification
 */

export type NotificationType = "warning-message" | "new-message" | "custom-message";

export type NotificationIcon = "notification" | "hard-rock" | "list" | "reward";

export type NotificationTitleLinkType = "normal" | "highlight";

export interface INotification {
  type?: NotificationType;
  avatar?: string;
  icon: NotificationIcon;
  title: Array<INotificationTitleText & INotificationTitleKeyword & INotificationTitleLink>;
  time: string;
}

export interface INotificationTitleText {
  text?: string;
}

export interface INotificationTitleKeyword {
  keyword?: string;
}

export interface INotificationTitleLink {
  link?: {
    type?: NotificationTitleLinkType;
    url: string;
    text: string;
  };
}

/**
 * Helpers
 */

export interface IAnyState {
  [x: string]: any;
}

export interface IFetchResult extends IAnyState {
  status: string;
  message: string;
}

export interface IRestApiResponse {
  code: string;
  data: {
    status: number;
    [x: string]: any;
  };
  message: string;
}

/**
 * Wizard
 */

export interface IWizardState {
  wizardName: string;
  formData: any;
  step: number;
  showScreenHelpModalState: any;
  now: any;
  isNeedReset: boolean;
}

export interface IWizardScreenProps {
  step?: number;
  setStep?: any;
  stepsCount?: any;
  steps?: Array<any>;
  onPrevClick?: any;
  onNextClick?: any;
  formHelpComponent?: any;
  isAllowPrevButton?: boolean;
  isIgnoreStepNumber?: boolean;
  visibleStep?: number;
  visibleStepsCount?: number;
  goNextStep?: any;
  goPrevStep?: any;
  icon?: any;
  title?: string;
  isRequired?: boolean;
  name?: string;
  maxLength?: number;
  placeholder?: string;
  howtoTitle?: string;
  howtoUrl?: string;
  isShowHeader?: boolean;
  formData?: any;
  setFormData?: (formData: any) => void;
  screenName?: string;
  selectOptions?: Array<any>;
  customOptions?: Array<any>;
  onWizardComplete?: any;
  onWizardCancel?: any;
  isMultiple?: boolean;
  helpPageSlug?: string;
  formFieldNameList?: Array<string>;
  description?: string;
  acceptFileFormat?: string;
  screenForm?: any;
  screenBottomBar?: any;
  shortTitle?: string;
  formFieldPlaceholders?: any;
  bottomBarTitle?: string;
}

export interface IWizardInputProps {
  placeholder?: string;
  handleInput: any;
  inputUseRef: any;
  value?: any;
  name?: string;
  maxLength?: number;
  selectOptions?: Array<any>;
  customOptions?: Array<any>;
  isMultiple?: boolean;
}

export interface IWizardActions {
  setWizardName: Action<IWizardState, string>;
  setState: Action<IWizardState, IWizardState>;
  setFormData: Action<IWizardState, any>;
  setStep: Action<IWizardState, number>;
  setShowScreenHelpModalState?: Action<IWizardState, any>;
  resetWizard?: Action<IWizardState>;
  setNeedReset?: Action<IWizardState, boolean>;
}

export interface IWizardThunks {
  loadWizardData: Thunk<IWizardActions>;
  saveWizardData: Thunk<IWizardActions>;
}

export interface IWizardModel extends IWizardState, IWizardActions, IWizardThunks {}

export interface ICreateTaskWizardState extends IWizardState {
  rewardList: Array<any>;
  taskTagList: Array<any>;
  ngoTagList: Array<any>;
  helpPageSlug: string;
  formFieldPlaceholders?: any;
  getRandomPlaceholder?: Computed<ICreateTaskWizardState, any>;
}

export interface ICreateTaskWizardActions extends IWizardActions {
  setRewardList: Action<ICreateTaskWizardState, Array<any>>;
  setTaskTagList: Action<ICreateTaskWizardState, Array<any>>;
  setNgoTagList: Action<ICreateTaskWizardState, Array<any>>;
  setHelpPageSlug: Action<ICreateTaskWizardState, string>;
  setFormFieldPlaceholders?: Action<ICreateTaskWizardState, any>;
}

export interface ICreateTaskWizardThunks extends IWizardThunks {
  loadTaxonomyData: Thunk<ICreateTaskWizardActions>;
  formFieldPlaceholdersRequest: Thunk<ICreateTaskWizardActions>;
}

export interface ICreateTaskWizardModel
  extends ICreateTaskWizardState,
    ICreateTaskWizardActions,
    ICreateTaskWizardThunks {}

export interface ICompleteTaskWizardPartner {
  databaseId: number;
  name: string;
  slug: string;
}

export interface ICompleteTaskWizardUser {
  databaseId: number;
  name: string;
  slug: string;
  isAuthor: boolean;
}

export interface ICompleteTaskWizardMeta {
  databaseId: number;
  slug: string;
  title?: string;
}

export interface ICompleteTaskWizardState extends IWizardState {
  user: ICompleteTaskWizardUser;
  partner: ICompleteTaskWizardPartner;
  task: ICompleteTaskWizardMeta;
}

export interface ICompleteTaskWizardActions extends IWizardActions {
  setInitState: Action<
    IWizardState,
    {
      user: ICompleteTaskWizardUser;
      partner: ICompleteTaskWizardPartner;
      task: ICompleteTaskWizardMeta;
    }
  >;
  resetFormData: Action<ICompleteTaskWizardState>;
  resetStep: Action<ICompleteTaskWizardState>;
  resetWizard?: Action<ICompleteTaskWizardState>;
}

export interface ICompleteTaskWizardThunks extends IWizardThunks {
  loadWizardData: Thunk<ICompleteTaskWizardActions>;
  removeWizardData: Thunk<ICompleteTaskWizardActions>;
  newReviewRequest: Thunk<
    ICompleteTaskWizardActions,
    {
      user: ICompleteTaskWizardUser;
      partner: ICompleteTaskWizardPartner;
      task: ICompleteTaskWizardMeta;
      reviewRating: number;
      communicationRating: number;
      reviewText: string;
    }
  >;
}

export interface ICompleteTaskWizardModel
  extends ICompleteTaskWizardState,
    ICompleteTaskWizardActions,
    ICompleteTaskWizardThunks {}

export interface ITaskToPortfolioWizardState extends IWizardState {
  createdPortfolioItemSlug: string;
  doer: ICompleteTaskWizardPartner;
  task: ICompleteTaskWizardMeta;
}

export interface ITaskToPortfolioWizardActions extends IWizardActions {
  setInitState: Action<
    IWizardState,
    {
      doer: ICompleteTaskWizardPartner;
      task: ICompleteTaskWizardMeta;
    }
  >;
  resetFormData: Action<ITaskToPortfolioWizardState>;
  resetStep: Action<ITaskToPortfolioWizardState>;
  resetWizard?: Action<ITaskToPortfolioWizardState>;
  setCreatedPortfolioItemSlug: Action<ITaskToPortfolioWizardState, string>;
}

export interface ITaskToPortfolioWizardThunks extends IWizardThunks {
  loadWizardData: Thunk<ITaskToPortfolioWizardActions>;
  removeWizardData: Thunk<ITaskToPortfolioWizardActions>;
  newPortfolioItemRequest: Thunk<
  ITaskToPortfolioWizardActions,
    {
      doer: ICompleteTaskWizardPartner;
      task: ICompleteTaskWizardMeta;
      title: string;
      description: string;
      resultLink?: string;
      workDetails?: string;
      preview?: number;
      fullImage?: number;
    }
  >;
}

export interface ITaskToPortfolioWizardModel
  extends ITaskToPortfolioWizardState,
    ITaskToPortfolioWizardActions,
    ITaskToPortfolioWizardThunks {}

/**
 * Help center page
 */

export interface IHelpPageState {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  helpCategories: Array<any>;
}

export interface IHelpPageActions {
  initializeState: Action<IHelpPageModel>;
  setState: Action<IHelpPageState, IHelpPageState>;
}

export interface IHelpPageThunks {
  helpPageRequest: Thunk<IHelpPageActions, string>;
}

export interface IHelpPageModel extends IHelpPageState, IHelpPageActions, IHelpPageThunks {}

/**
 * News
 */

export interface INewsListModel extends INewsListState, INewsListActions, INewsListThunks {}

export interface INewsListState {
  items: Array<INewsItemState>;
  isNewsListLoaded: boolean;
  hasNextPage?: boolean;
  lastViewedListItem?: string | null;
}

export interface INewsListActions {
  initializeState: Action<INewsListModel>;
  setState: Action<INewsListModel, INewsListState>;
  resetNewsListLoaded: Action<INewsListModel>;
  appendNewsList: Action<INewsListModel, Array<INewsItemState>>;
  setNewsList: Action<INewsListModel, Array<INewsItemState>>;
  setNewsListLoadMoreState: Action<INewsListModel, any>;
}

export interface INewsListThunks {
  loadMoreNewsRequest: Thunk<INewsListActions>;
  onLoadMoreNewsRequestSuccess: ThunkOn<INewsListModel>;
}

export interface IOtherNewsListModel
  extends INewsListState,
    INewsListActions,
    IOtherNewsListThunks {}

export interface IOtherNewsListThunks {
  loadOtherNewsRequest: Thunk<INewsListActions, { excludeNewsItem: INewsItemState }>;
  onLoadOtherNewsRequestSuccess: ThunkOn<IOtherNewsListModel>;
}

/**
 * NewsItem
 */

export interface INewsItemModel extends INewsItemState, INewsItemActions, INewsItemThunks {}

export interface INewsItemState {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  date?: string;
  dateGmt?: string;
  seo?: IPageSEO;
  featuredImage?: {
    mediaItemUrl;
    mediaDetails: {
      sizes: Array<{
        sourceUrl: string;
        name: string;
      }>;
    };
  };
}

export interface INewsItemActions {
  initializeState: Action<INewsItemModel>;
  setState: Action<INewsItemModel, INewsItemState>;
}

export interface INewsItemThunks {}

/**
 * HomePage
 */

export interface IHomePageModel extends IHomePageState, IHomePageActions, IHomePageThunks {}

export interface IHomePageState extends IPageState {
  id: string;
  taskList: Array<ITaskState>;
  newsList?: INewsListModel;
  stats: any;
}

export interface IHomePageActions {
  initializeState: Action<IHomePageModel>;
  setState: Action<IHomePageModel, IHomePageState>;
  setStats: Action<IHomePageModel, any>;
  setTaskList: Action<IHomePageModel, any>;
  setNewsList: Action<IHomePageModel, any>;
}

export interface IHomePageThunks {
  loadStatsRequest: Thunk<IHomePageActions>;
  onLoadStatsRequestSuccess: ThunkOn<IHomePageModel>;
}
