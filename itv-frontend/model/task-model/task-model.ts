import { action, thunk, thunkOn, computed } from "easy-peasy";
import * as _ from "lodash";
import {
  IFetchResult,
  IStoreModel,
  ITaskState,
  ITaskActions,
  ITaskThunks,
  ITaskComment,
  ITaskTimelineItem,
  ITaskReviewer,
  ITaskCommentLiker,
} from "../model.typing";
import { queriedFields as approvedDoerQueriedFields } from "./task-approved-doer";
import { queriedFields as authorQueriedFields } from "./task-author";
import { graphqlQuery as doerGraphqlQuery } from "./task-doer";
import { findCommentById, graphqlQuery as commentGraphqlQuery } from "./task-comment";
import { getLocaleDateTimeISOString, stripTags, getAjaxUrl } from "../../utilities/utilities";
import * as utils from "../../utilities/utilities";

const taskState: ITaskState = {
  id: "",
  databaseId: 0,
  title: "",
  slug: "",
  content: "",
  date: "",
  dateGmt: "",
  viewsCount: 0,
  doerCandidatesCount: 0,
  status: undefined,
  reviewsDone: false,
  nextTaskSlug: "",
  approvedDoer: null,
  author: null,
  doers: null,
  comments: null,
  timeline: null,
  reviews: null,
  isApproved: false,
  pemalinkPath: "",
  nonceContactForm: "",
  result: "",
  resultHtml: "",
  impact: "",
  impactHtml: "",
  contentHtml: "",
  references: "",
  referencesHtml: "",
  referencesList: [],
  externalFileLinks: "",
  externalFileLinksList: [],
  preferredDoers: "",
  preferredDuration: "",
  cover: null,
  coverImgSrcLong: "",
  files: [],
  deadline: "",
  hasCloseSuggestion: computed(taskState => {
    return _.some(
      taskState.timeline,
      item => item.type === "close_suggest" && item.status === "current"
    );
  }),
};

export const queriedFields = Object.entries(taskState).reduce((fields, [fieldKey, fieldValue]) => {
  if (!Object.is(fieldValue, null) && ["files"].findIndex(fl => fl === fieldKey) === -1) {
    fields.push(fieldKey);
  }
  return fields;
}, []) as Array<keyof ITaskState>;

export const graphqlFeaturedImage = `
  featuredImage {
    sourceUrl(size: LARGE)
  }
`;

export const graphqlTags = `
  tags(where: {hideEmpty: false, shouldOutputInFlatList: true}) {
    nodes {
      id
      databaseId
      name
      slug
    }
  }

  rewardTags(where: {hideEmpty: false, shouldOutputInFlatList: true}) {
    nodes {
      id
      databaseId
      name
      slug
    }
  }

  ngoTaskTags(where: {hideEmpty: false, shouldOutputInFlatList: true}) {
    nodes {
      id
      databaseId
      name
      slug
    }
  }
`;

export const graphqlQuery = {
  updateStatus: `
  mutation updateTaskStatus($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      task {
        status
      }
    }
  }`,
  getBySlug: `
  query Task($taskSlug: ID!) {
    task(id: $taskSlug, idType: SLUG) {
      isRestricted
      
      ${queriedFields.join("\n")}

      approvedDoer {
        ${approvedDoerQueriedFields.join("\n")}
      }
      
      author {
        ${authorQueriedFields.join("\n")}
      }
      
      ${graphqlFeaturedImage}

      ${graphqlTags}

      cover {
        databaseId
        mediaItemUrl
      }

      files {
        databaseId
        mediaItemUrl
      }
    }
  }`,
};

const taskActions: ITaskActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, taskState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  updateStatus: action((taskState, taskStatus) => {
    Object.assign(taskState, taskStatus);
  }),
  updateModerationStatus: action((taskState, moderationStatus) => {
    Object.assign(taskState, moderationStatus);
  }),
  updateApprovedDoer: action((taskState, approvedDoer) => {
    Object.assign(taskState, { approvedDoer });
  }),
  declineApprovedDoer: action(taskState => {
    Object.assign(taskState, { approvedDoer: null });
  }),
  updateDoers: action((taskState, doers) => {
    Object.assign(taskState, { doers });
  }),
  updateComments: action((taskState, comments) => {
    Object.assign(taskState, { comments });
  }),
  updateTimeline: action((taskState, timeline) => {
    Object.assign(taskState, { timeline });
  }),
  updateReviews: action((taskState, reviews) => {
    Object.assign(taskState, { reviews });
  }),
  likeComment: action((taskState, { commentId, likesCount, likers }) => {
    const comments = taskState.comments;

    if (!Array.isArray(comments)) return taskState;

    const comment: ITaskComment = findCommentById(commentId, comments);

    if (typeof comment === "undefined") return taskState;

    comment.likesCount = likesCount;
    comment.likers = likers;
    comment.likeGiven = true;
  }),
  unlikeComment: action((taskState, { commentId, likesCount, likers }) => {
    const comments = taskState.comments;

    if (!Array.isArray(comments)) return taskState;

    const comment: ITaskComment = findCommentById(commentId, comments);

    if (typeof comment === "undefined") return taskState;

    comment.likesCount = likesCount;
    comment.likers = likers;
    comment.likeGiven = false;
  }),
};

const taskThunks: ITaskThunks = {
  adminSupportRequest: thunk(
    async (actions, { messageText, email, addSnackbar, callbackFn }, { getStoreState }) => {
      if (!messageText) return;

      const {
        session: { validToken: token },
        components: {
          task: { slug: taskSlug, nonceContactForm: nonce },
        },
      } = getStoreState() as IStoreModel;
      const action = "add-message";
      const formData = new FormData();

      formData.append("name", "");
      formData.append("email", email);
      formData.append("message", messageText);
      formData.append("page_url", `/tasks/${taskSlug}`);
      formData.append("nonce", nonce);
      formData.append("auth_token", String(token));

      try {
        const result = await utils.tokenFetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, message: responseMessage } = await (<Promise<IFetchResult>>(
          result.json()
        ));
        if (responseStatus === "fail") {
          addSnackbar({
            context: "error",
            text: stripTags(responseMessage),
          });
        } else {
          callbackFn && callbackFn();
          addSnackbar({
            context: "success",
            text: "Сообщение успешно отправлено.",
          });
        }
      } catch (error) {
        console.error(error);
        addSnackbar({
          context: "error",
          text: "Во время отправки сообщения произашла ошибка.",
        });
      }
    }
  ),
  taskRequest: thunk(async ({ setState }, _, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        task: { slug: taskSlug },
      },
    } = getStoreState() as IStoreModel;

    import("graphql-request").then(async ({ GraphQLClient }) => {
      const getTaskStateQuery = graphqlQuery.getBySlug;
      const graphQLClient = new GraphQLClient(process.env.GraphQLServer, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      try {
        const { task } = await graphQLClient.request(getTaskStateQuery, {
          taskSlug: String(taskSlug),
        });
        setState(task);
      } catch (error) {
        console.error(error.message);
      }
    });
  }),
  suggestCloseTaskRequest: thunk(
    async (actions, { suggestComment, callbackFn }, { getStoreState }) => {
      const {
        session: { validToken: token },
        components: {
          task: { databaseId: taskId, slug: taskSlug },
        },
      } = getStoreState() as IStoreModel;
      const action = "suggest-close-task";
      const formData = new FormData();

      formData.append("task-id", String(taskId));
      formData.append("auth_token", String(token));

      if (suggestComment) {
        formData.append("message", suggestComment);
      }

      try {
        const result = await utils.tokenFetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, message: responseMessage } = await (<
          Promise<{
            status: string;
            message?: string;
          }>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else {
          callbackFn && callbackFn();
          return {
            responseStatus,
            taskSlug,
            token,
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  onSuggestCloseTaskRequest: thunkOn(
    actions => actions.suggestCloseTaskRequest.successType,
    ({ timelineRequest, taskRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      taskRequest();
      timelineRequest();
    }
  ),
  suggestCloseDateRequest: thunk(
    async (actions, { suggestComment, suggestedCloseDate, callbackFn }, { getStoreState }) => {
      if (!suggestComment || !suggestedCloseDate) return;

      const {
        session: { validToken: token },
        components: {
          task: { databaseId: taskId },
        },
      } = getStoreState() as IStoreModel;
      const action = "suggest-close-date";
      const formData = new FormData();

      formData.append("message", suggestComment);
      formData.append(
        "due_date",
        suggestedCloseDate.toISOString().replace(/^(.{10})T(.{8}).*/, "$1 $2")
      );
      formData.append("task-id", String(taskId));
      formData.append("auth_token", String(token));

      try {
        const result = await utils.tokenFetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, message: responseMessage } = await (<
          Promise<{
            status: string;
            message?: string;
          }>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else {
          callbackFn && callbackFn();
          return {
            responseStatus,
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  onSuggestCloseDateRequest: thunkOn(
    actions => actions.suggestCloseDateRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  acceptSuggestedDateRequest: thunk(async (actions, { timelineItemId }, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        task: { databaseId: taskId },
      },
    } = getStoreState() as IStoreModel;
    const action = "accept-close-date";
    const formData = new FormData();

    formData.append("timeline-item-id", String(timelineItemId));
    formData.append("task-id", String(taskId));
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<
        Promise<{
          status: string;
          message?: string;
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        return {
          responseStatus,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }),
  onAcceptSuggestedDateRequest: thunkOn(
    actions => actions.acceptSuggestedDateRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  rejectSuggestedDateRequest: thunk(async (actions, { timelineItemId }, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        task: { databaseId: taskId },
      },
    } = getStoreState() as IStoreModel;
    const action = "reject-close-date";
    const formData = new FormData();

    formData.append("timeline-item-id", String(timelineItemId));
    formData.append("task-id", String(taskId));
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<
        Promise<{
          status: string;
          message?: string;
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        return {
          responseStatus,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }),
  onRejectSuggestedDateRequest: thunkOn(
    actions => actions.rejectSuggestedDateRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  acceptSuggestedCloseRequest: thunk(async (actions, { timelineItemId }, { getStoreState }) => {
    const {
      session: { validToken: token },
      entrypoint: {
        page: { slug: pageSlug },
      },
      components: {
        task: { databaseId: taskId },
      },
    } = getStoreState() as IStoreModel;
    const action = "accept-close";
    const formData = new FormData();

    formData.append("timeline-item-id", String(timelineItemId));
    formData.append("task-id", String(taskId));
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<
        Promise<{
          status: string;
          message?: string;
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        return {
          pageSlug,
          token,
          responseStatus,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }),
  onAcceptSuggestedCloseRequest: thunkOn(
    actions => actions.acceptSuggestedCloseRequest.successType,
    ({ taskRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      taskRequest();
    }
  ),
  onAcceptSuggestedCloseRequestUpdateTimeline: thunkOn(
    actions => actions.acceptSuggestedCloseRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  rejectSuggestedCloseRequest: thunk(async (actions, { timelineItemId }, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        task: { databaseId: taskId },
      },
    } = getStoreState() as IStoreModel;
    const action = "reject-close";
    const formData = new FormData();

    formData.append("timeline-item-id", String(timelineItemId));
    formData.append("task-id", String(taskId));
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<
        Promise<{
          status: string;
          message?: string;
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        return {
          responseStatus,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }),
  onRejectSuggestedCloseRequest: thunkOn(
    actions => actions.rejectSuggestedCloseRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  newReviewRequest: thunk(
    async (actions, { reviewRating, reviewText, callbackFn }, { getStoreState }) => {
      const {
        session: { validToken: token, isTaskAuthorLoggedIn },
        entrypoint: {
          page: { slug: pageSlug },
        },
        components: {
          task: {
            databaseId: taskId,
            author: { databaseId: authorId },
            approvedDoer,
            reviews,
          },
        },
      } = getStoreState() as IStoreModel;
      const formData = new FormData();
      formData.append("review-rating", String(reviewRating));
      formData.append("review-message", reviewText);
      formData.append("task-id", String(taskId));

      let action = "";

      if (isTaskAuthorLoggedIn) {
        action = "leave-review";
        formData.append("doer-id", String(approvedDoer?.databaseId));
      } else {
        action = "leave-review-author";
        formData.append("author-id", String(authorId));
      }

      try {
        const result = await utils.tokenFetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, message: responseMessage } = await (<
          Promise<{
            status: string;
            message?: string;
          }>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
          return { responseStatus };
        } else {
          callbackFn && callbackFn();
          return {
            newReview: {
              id: "",
              author_id: String(authorId),
              doer_id: String(approvedDoer?.databaseId),
              task_id: String(taskId),
              message: reviewText,
              rating: String(reviewRating),
              time_add: getLocaleDateTimeISOString(),
            },
            pageSlug,
            token,
            isTaskAuthorLoggedIn,
            reviews,
            responseStatus,
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  onNewReviewRequestSuccess: thunkOn(
    actions => actions.newReviewRequest.successType,
    ({ setState: setTaskState, updateReviews }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      const { pageSlug, newReview, token, isTaskAuthorLoggedIn, reviews } = result;

      updateReviews({
        ...reviews,
        ...{
          [`reviewFor${isTaskAuthorLoggedIn ? "Doer" : "Author"}`]: newReview,
        },
      });

      import("graphql-request").then(async ({ GraphQLClient }) => {
        const getTaskStateQuery = graphqlQuery.getBySlug;
        const graphQLClient = new GraphQLClient(process.env.GraphQLServer, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        try {
          const { task } = await graphQLClient.request(getTaskStateQuery, {
            taskSlug: String(pageSlug),
          });
          setTaskState(task);
        } catch (error) {
          console.error(error.message);
        }
      });
    }
  ),
  timelineRequest: thunk(async ({ updateTimeline }, _, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        task: { id: taskId },
      },
    } = getStoreState() as IStoreModel;
    const action = "get-task-timeline";
    const formData = new FormData();

    formData.append("task_gql_id", taskId);
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage, timeline } = await (<
        Promise<{
          status: string;
          message?: string;
          timeline?: Array<ITaskTimelineItem>;
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        updateTimeline(timeline);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  reviewsRequest: thunk(async ({ updateReviews }, _, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        task: { databaseId: taskId },
      },
    } = getStoreState() as IStoreModel;
    const action = "get-task-reviews";
    const formData = new FormData();

    formData.append("task-id", String(taskId));
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage, reviews } = await (<
        Promise<{
          status: string;
          message?: string;
          reviews?: {
            reviewForAuthor?: ITaskReviewer;
            reviewForDoer?: ITaskReviewer;
          };
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        updateReviews(reviews);
      }
    } catch (error) {
      console.error(error);
    }
  }),
  newCommentRequest: thunk(
    async (actions, { parentCommentId, commentBody, callbackFn }, { getStoreState }) => {
      const {
        session: {
          user: { id, fullName, itvAvatar, memberRole, profileURL },
          validToken: token,
        },
        components: {
          task: { id: taskId, comments },
        },
      } = getStoreState() as IStoreModel;
      const action = "submit-comment";
      const formData = new FormData();

      formData.append("task_gql_id", taskId);
      formData.append("comment_body", commentBody);
      parentCommentId && formData.append("parent_comment_id", parentCommentId);
      formData.append("auth_token", String(token));

      try {
        const result = await utils.tokenFetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, comment, message: responseMessage } = await (<
          Promise<{
            status: string;
            comment?: {
              id: string;
              content: string;
              date: string;
            };
            message?: string;
          }>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
          return { responseStatus };
        } else {
          callbackFn && callbackFn();
          return {
            comments,
            newComment: comment,
            author: { id, fullName, itvAvatar, memberRole, profileURL },
            responseStatus,
          };
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  onNewCommentRequestSuccess: thunkOn(
    actions => actions.newCommentRequest.successType,
    ({ updateComments }, { payload: { parentCommentId }, result }) => {
      if (result?.responseStatus !== "ok") return;

      const { author, newComment, comments } = result;

      Object.assign(newComment, {
        author,
        dateGmt: newComment.date,
        likesCount: 0,
        likeGiven: false,
      });

      if (parentCommentId) {
        const parentComment = findCommentById(parentCommentId, comments);

        if (parentComment?.replies) {
          if (Array.isArray(parentComment.replies.nodes)) {
            parentComment.replies.nodes.push(newComment);
          } else {
            parentComment.replies = {
              nodes: [newComment],
            };
          }
        }
      } else {
        comments.push(newComment);
      }

      updateComments([].concat(comments));
    }
  ),
  commentLikeRequest: thunk(async ({ likeComment }, commentId, { getStoreState }) => {
    const {
      session: { validToken: token },
    } = getStoreState() as IStoreModel;
    const action = "like-comment";
    const formData = new FormData();

    formData.append("comment_gql_id", commentId);
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage, likesCount, likers } = await (<
        Promise<{
          status: string;
          message?: string;
          likesCount?: number;
          likers?: Array<ITaskCommentLiker>;
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        likeComment({ commentId, likesCount, likers });
      }
    } catch (error) {
      console.error(error);
    }
  }),
  commentUnlikeRequest: thunk(async ({ unlikeComment }, commentId, { getStoreState }) => {
    const {
      session: { validToken: token },
    } = getStoreState() as IStoreModel;
    const action = "unlike-comment";
    const formData = new FormData();

    formData.append("comment_gql_id", commentId);
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage, likesCount, likers } = await (<
        Promise<{
          status: string;
          message?: string;
          likesCount?: number;
          likers?: Array<ITaskCommentLiker>;
        }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        unlikeComment({ commentId, likesCount, likers });
      }
    } catch (error) {
      console.error(error);
    }
  }),
  manageDoerRequest: thunk(async (actions, { action, doer, callbackFn }, { getStoreState }) => {
    const {
      session: { validToken: token },
      components: {
        task: { id: taskId },
      },
    } = getStoreState() as IStoreModel;
    const formData = new FormData();

    formData.append("doer_gql_id", doer.id);
    formData.append("task_gql_id", taskId);
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<
        Promise<{ status: string; message: string }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        callbackFn && callbackFn();
      }
    } catch (error) {
      console.error(error);
    }
  }),
  moderateRequest: thunk(async (actions, { action, taskId, callbackFn }) => {
    const formData = new FormData();
    formData.append("task_gql_id", taskId);

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<
        Promise<{ status: string; message: string }>
      >result.json());
      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        callbackFn && callbackFn();
      }
    } catch (error) {
      console.error(error);
    }
  }),
  commentsRequest: thunk(async ({ updateComments }, _, { getStoreState }) => {
    const {
      components: {
        task: { databaseId: taskDatabaseId },
      },
    } = getStoreState() as IStoreModel;
    const { request } = await import("graphql-request");
    const {
      comments: { nodes: commentCollection },
    } = await request(process.env.GraphQLServer, commentGraphqlQuery.commentsRequest, {
      taskId: taskDatabaseId,
    });

    updateComments(commentCollection);
  }),
  doersRequest: thunk(async ({ updateDoers }, _, { getStoreState }) => {
    const {
      components: {
        task: { id: taskId },
      },
    } = getStoreState() as IStoreModel;
    const { request } = await import("graphql-request");
    const { taskDoers: doers } = await request(
      process.env.GraphQLServer,
      doerGraphqlQuery.doersRequest,
      {
        taskGqlId: taskId,
      }
    );

    updateDoers(doers);
  }),
  addDoerRequest: thunk(async ({ updateDoers }, _, { getStoreState }) => {
    const {
      session: {
        validToken: token,
        user: {
          id,
          databaseId,
          fullName,
          slug,
          profileURL,
          itvAvatar,
          solvedTasksCount,
          doerReviewsCount,
          isPasekaMember,
        },
      },
      components: {
        task: { id: taskId, doers },
      },
    } = getStoreState() as IStoreModel;
    const doer = {
      id,
      databaseId,
      fullName,
      slug,
      profileURL,
      itvAvatar,
      solvedTasksCount,
      doerReviewsCount,
      isPasekaMember,
    };
    const action = "add-candidate";
    const formData = new FormData();

    formData.append("task_gql_id", taskId);
    formData.append("auth_token", String(token));

    try {
      const result = await utils.tokenFetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const { status: responseStatus, message: responseMessage } = await (<
        Promise<{ status: string; message: string }>
      >result.json());

      if (responseStatus === "fail") {
        console.error(stripTags(responseMessage));
      } else {
        if (Array.isArray(doers)) {
          doers.push(doer);
          updateDoers([].concat(doers));
        } else {
          updateDoers([doer]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }),
  statusChangeRequest: thunk(
    async ({ updateStatus }, { status, callbackFn }, { getStoreState }) => {
      const {
        session: { validToken: token },
        components: {
          task: { databaseId },
        },
      } = getStoreState() as IStoreModel;
      const action = `${status === "draft" ? "un" : ""}publish-task`;
      const formData = new FormData();

      formData.append("task-id", String(databaseId));
      formData.append("auth_token", String(token));

      try {
        const result = await utils.tokenFetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const { status: responseStatus, message: responseMessage } = await (<
          Promise<{ status: string; message: string }>
        >result.json());

        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else {
          updateStatus({ status });
          callbackFn && callbackFn();
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const taskModel = { ...taskState, ...taskActions, ...taskThunks };

export default taskModel;
