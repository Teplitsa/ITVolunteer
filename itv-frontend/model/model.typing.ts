import { Action, ActionOn, Thunk, ThunkOn, Computed } from "easy-peasy";
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

export interface ISessionModel
  extends ISessionState,
    ISessionActions,
    ISessionThunks {}

export interface ISessionState {
  token: ISessionToken;
  user: ISessionUser;
  validToken?: Computed<ISessionModel, string>;
  isLoggedIn?: Computed<ISessionModel, boolean>;
  isAdmin?: Computed<ISessionModel, boolean>;
  isTaskAuthorLoggedIn?: Computed<ISessionModel, boolean, IStoreModel>;
  isUserTaskCandidate?: Computed<ISessionModel, boolean, IStoreModel>;
  canUserReplyToComment?: Computed<ISessionModel, boolean, IStoreModel>;
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
  fullName: string;
  profileURL: string;
  memberRole: string;
  itvAvatar: string;
  authorReviewsCount: number;
  solvedTasksCount: number;
  doerReviewsCount: number;
  isPasekaMember: boolean;
  isPartner: boolean;
  subscribeTaskList?: any | null;
  logoutUrl?: string;
  isAdmin?: boolean;
}

export interface ISessionActions {
  setState: Action<ISessionModel, ISessionState>;
  setSubscribeTaskList: Action<ISessionState, any>;
  loadSubscribeTaskList: Thunk<ISessionActions>;
}

export interface ISessionThunks {
  login: Thunk<ISessionActions, { username: string; password: string }>;
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
}

/**
 * Page
 */

export type PostTypeWithArchive = "post" | "task";

export type PostType = "page" | PostTypeWithArchive;

export interface IPageModel extends IPageState, IPageActions {}

export interface IPageState {
  slug: string;
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

export interface IComponentsModel extends IComponentsState {}

export interface IComponentsState {
  honors?: IHonorsPageModel;
  paseka?: IPasekaPageModel;
  task?: ITaskModel;
  taskList?: ITaskListModel;
  taskListFilter?: ITaskListFilterModel;
  userNotif?: IUserNotifModel;
}

/**
 * Paseka
 */

export interface IPasekaPageModel
  extends IPasekaPageState,
    IPasekaPageActions {}

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

export interface IHonorsPageModel
  extends IHonorsPageState,
    IHonorsPageActions {}

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
 * Task
 */

export type TaskStatus = "draft" | "publish" | "in_work" | "closed";

export interface ITaskModel extends ITaskState, ITaskActions, ITaskThunks {}

export interface ITaskState {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  content: string;
  date: string;
  dateGmt: string;
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
  organizationName: string;
  organizationDescription: string;
  organizationLogo: string;
  isPartner: boolean;
}

export interface ITaskDoer {
  id: string;
  databaseId: number;
  fullName: string;
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
  author: ITaskCommentAuthor;
  replies?: { nodes: Array<ITaskComment> };
}

export interface ITaskCommentAuthor {
  id: string;
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

export interface ITaskActions {
  initializeState: Action<ITaskModel>;
  setState: Action<ITaskModel, ITaskState>;
  updateStatus: Action<ITaskModel, { status: TaskStatus }>;
  updateModerationStatus: Action<ITaskModel, { isApproved: boolean }>;
  updateApprovedDoer: Action<ITaskModel, ITaskApprovedDoer>;
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
  likeComment: Action<ITaskModel, { commentId: string; likesCount: number }>;
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
  statusChangeRequest: Thunk<ITaskActions, { status: TaskStatus }>;
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
      suggestComment: string;
      callbackFn?: () => void;
    }
  >;
  onSuggestCloseTaskRequest: ThunkOn<ITaskModel>;
}

/**
 * TaskList
 */

export interface ITaskListModel extends ITaskListState, ITaskListActions {}

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

/**
 * TaskListItem
 */

export interface ITaskListItemModel extends ITaskListItemState {}

export interface ITaskListItemState {
  id: string;
  title: string;
  slug: string;
  content: string;
  date: string;
  dateGmt: string;
  viewsCount: number;
  doerCandidatesCount: number;
  status?: TaskStatus;
  reviewsDone: boolean;
  nextTaskSlug: string;
  approvedDoer?: ITaskApprovedDoer;
  author?: ITaskAuthor;
  [x: string]: any;
}

/**
 * TaskListFilter
 */

export interface ITaskListFilterModel
  extends ITaskListFilterState,
    ITaskListFilterActions {}
export interface ITaskListFilterState {
  optionCheck;
  statusStats;
  tipClose: Object;
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
 * Helpers
 */

export interface IFetchResult {
  status: string;
  message: string;
  [x: string]: any;
}
