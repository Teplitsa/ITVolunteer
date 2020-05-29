import { Action, ActionOn, Thunk, ThunkOn, Computed } from "easy-peasy";

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
}

export interface ISessionActions {
  setState: Action<ISessionModel, ISessionState>;
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
  title: string;
  meta?: IPageSEOMeta;
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
  task?: ITaskModel;
  taskList?: ITaskListModel;
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

export interface ITaskActions {
  initializeState: Action<ITaskModel>;
  setState: Action<ITaskModel, ITaskState>;
  updateStatus: Action<ITaskModel, { status: TaskStatus }>;
  updateApprovedDoer: Action<ITaskModel, ITaskApprovedDoer>;
  updateDoers: Action<ITaskModel, Array<ITaskDoer>>;
  updateComments: Action<ITaskModel, Array<ITaskComment>>;
  likeComment: Action<ITaskModel, { commentId: string; likesCount: number }>;
}

export interface ITaskThunks {
  manageDoerRequest: Thunk<
    ITaskActions,
    {
      action: "approve-candidate" | "decline-candidate";
      doer: ITaskDoer;
      callbackFn?: () => void;
    }
  >;
  statusChangeRequest: Thunk<ITaskActions, { status: TaskStatus }>;
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
}

/**
 * TaskList
 */

export interface ITaskListModel extends ITaskListState, ITaskListActions {}

export interface ITaskListState {
  items: Array<ITaskListItemState>;
  isTaskListLoaded: boolean;
  optionCheck: any;
  statusStats: Object;
}

export interface ITaskListActions {
  initializeState: Action<ITaskListModel>;
  setState: Action<ITaskListModel, ITaskListState>;
  resetTaskListLoaded: Action<ITaskListModel>;
  appendTaskList: Action<ITaskListModel, Array<ITaskListItemState>>;
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
}
