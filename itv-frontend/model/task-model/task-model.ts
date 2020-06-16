import { action, thunk, thunkOn } from "easy-peasy";
import {
  IStoreModel,
  ITaskState,
  ITaskActions,
  ITaskThunks,
  ITaskComment,
  ITaskTimelineItem,
  ITaskReviewer,
} from "../model.typing";
import { queriedFields as approvedDoerQueriedFields } from "./task-approved-doer";
import { queriedFields as authorQueriedFields } from "./task-author";
import { graphqlQuery as doerGraphqlQuery } from "./task-doer";
import {
  findCommentById,
  graphqlQuery as commentGraphqlQuery,
} from "./task-comment";
import {
  getLocaleDateTimeISOString,
  stripTags,
  getAjaxUrl,
} from "../../utilities/utilities";

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
  nonceContactForm: "",
};

export const queriedFields = Object.entries(taskState).reduce(
  (fields, [fieldKey, fieldValue]) => {
    if (!Object.is(fieldValue, null)) {
      fields.push(fieldKey);
    }
    return fields;
  },
  []
) as Array<keyof ITaskState>;

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
      ${queriedFields.join("\n")}

      approvedDoer {
        ${approvedDoerQueriedFields.join("\n")}
      }
      
      author {
        ${authorQueriedFields.join("\n")}
      }
      
      featuredImage {
        sourceUrl(size: LARGE)
      }        

      tags {
        nodes {
          id
          name
          slug
        }
      }

      rewardTags {
        nodes {
          id
          name
          slug
        }
      }

      ngoTaskTags {
        nodes {
          id
          name
          slug
        }
      }
    }
  }`,
};

const taskActions: ITaskActions = {
  initializeState: action((prevState) => {
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
  likeComment: action((taskState, { commentId, likesCount }) => {
    const comments = taskState.comments;

    if (!Array.isArray(comments)) return taskState;

    const comment: ITaskComment = findCommentById(commentId, comments);

    if (typeof comment === "undefined") return taskState;

    comment.likesCount = likesCount;
    comment.likeGiven = true;
  }),
};

const taskThunks: ITaskThunks = {
  suggestCloseTaskRequest: thunk(
    async (actions, { suggestComment, callbackFn }, { getStoreState }) => {
      if (!suggestComment) return;

      const {
        session: { validToken: token },
        components: {
          task: { databaseId: taskId },
        },
      } = getStoreState() as IStoreModel;
      const action = "suggest-close-task";
      const formData = new FormData();

      formData.append("message", suggestComment);
      formData.append("task-id", String(taskId));
      formData.append("auth_token", String(token));

      try {
        const result = await fetch(getAjaxUrl(action), {
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
  onSuggestCloseTaskRequest: thunkOn(
    (actions) => actions.suggestCloseTaskRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  suggestCloseDateRequest: thunk(
    async (
      actions,
      { suggestComment, suggestedCloseDate, callbackFn },
      { getStoreState }
    ) => {
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
        suggestedCloseDate
          .toLocaleString()
          .replace(/(\d{2})\.(\d{2})\.(\d{4}),\s([\d|:]+)/g, "$3-$2-$1 $4")
      );
      formData.append("task-id", String(taskId));
      formData.append("auth_token", String(token));

      try {
        const result = await fetch(getAjaxUrl(action), {
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
    (actions) => actions.suggestCloseDateRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  acceptSuggestedDateRequest: thunk(
    async (actions, { timelineItemId }, { getStoreState }) => {
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
        const result = await fetch(getAjaxUrl(action), {
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
    }
  ),
  onAcceptSuggestedDateRequest: thunkOn(
    (actions) => actions.acceptSuggestedDateRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  rejectSuggestedDateRequest: thunk(
    async (actions, { timelineItemId }, { getStoreState }) => {
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
        const result = await fetch(getAjaxUrl(action), {
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
    }
  ),
  onRejectSuggestedDateRequest: thunkOn(
    (actions) => actions.rejectSuggestedDateRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  acceptSuggestedCloseRequest: thunk(
    async (actions, { timelineItemId }, { getStoreState }) => {
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
        const result = await fetch(getAjaxUrl(action), {
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
    }
  ),
  onAcceptSuggestedCloseRequest: thunkOn(
    (actions) => actions.acceptSuggestedCloseRequest.successType,
    ({ setState: setTaskState }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      const { pageSlug, token } = result;

      import("graphql-request").then(async ({ GraphQLClient }) => {
        const { v4: uuidv4 } = await import("uuid");
        const updateTaskStateQuery = graphqlQuery.getBySlug;
        const graphQLClient = new GraphQLClient(process.env.GraphQLServer, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        try {
          const { task } = await graphQLClient.request(updateTaskStateQuery, {
            input: {
              clientMutationId: uuidv4(),
              taskSlug: pageSlug,
            },
          });
          setTaskState(task);
        } catch (error) {
          console.error(error.message);
        }
      });
    }
  ),
  rejectSuggestedCloseRequest: thunk(
    async (actions, { timelineItemId }, { getStoreState }) => {
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
        const result = await fetch(getAjaxUrl(action), {
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
    }
  ),
  onRejectSuggestedCloseRequest: thunkOn(
    (actions) => actions.newReviewRequest.successType,
    ({ timelineRequest }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      timelineRequest();
    }
  ),
  newReviewRequest: thunk(
    async (
      actions,
      { reviewRating, reviewText, callbackFn },
      { getStoreState }
    ) => {
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
        const result = await fetch(getAjaxUrl(action), {
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
    (actions) => actions.newReviewRequest.successType,
    ({ setState: setTaskState, updateReviews }, { result }) => {
      if (result?.responseStatus !== "ok") return;

      const {
        pageSlug,
        newReview,
        token,
        isTaskAuthorLoggedIn,
        reviews,
      } = result;

      updateReviews({
        ...reviews,
        ...{
          [`reviewFor${isTaskAuthorLoggedIn ? "Doer" : "Author"}`]: newReview,
        },
      });

      import("graphql-request").then(async ({ GraphQLClient }) => {
        const { v4: uuidv4 } = await import("uuid");
        const updateTaskStateQuery = graphqlQuery.getBySlug;
        const graphQLClient = new GraphQLClient(process.env.GraphQLServer, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        try {
          const { task } = await graphQLClient.request(updateTaskStateQuery, {
            input: {
              clientMutationId: uuidv4(),
              taskSlug: pageSlug,
            },
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
      const result = await fetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const {
        status: responseStatus,
        message: responseMessage,
        timeline,
      } = await (<
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
      const result = await fetch(getAjaxUrl(action), {
        method: "post",
        body: formData,
      });

      const {
        status: responseStatus,
        message: responseMessage,
        reviews,
      } = await (<
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
    async (
      actions,
      { parentCommentId, commentBody, callbackFn },
      { getStoreState }
    ) => {
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
        const result = await fetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const {
          status: responseStatus,
          comment,
          message: responseMessage,
        } = await (<
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
    (actions) => actions.newCommentRequest.successType,
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
  commentLikeRequest: thunk(
    async ({ likeComment }, commentId, { getStoreState }) => {
      const {
        session: { validToken: token },
      } = getStoreState() as IStoreModel;
      const action = "like-comment";
      const formData = new FormData();

      formData.append("comment_gql_id", commentId);
      formData.append("auth_token", String(token));

      try {
        const result = await fetch(getAjaxUrl(action), {
          method: "post",
          body: formData,
        });

        const {
          status: responseStatus,
          likesCount,
          message: responseMessage,
        } = await (<
          Promise<{ status: string; likesCount: number; message?: string }>
        >result.json());
        if (responseStatus === "fail") {
          console.error(stripTags(responseMessage));
        } else {
          likeComment({ commentId, likesCount });
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  manageDoerRequest: thunk(
    async (actions, { action, doer, callbackFn }, { getStoreState }) => {
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
        const result = await fetch(getAjaxUrl(action), {
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
    }
  ),
  moderateRequest: thunk(
    async (actions, { action, taskId, callbackFn }, { getStoreState }) => {
      const formData = new FormData();
      formData.append("task_gql_id", taskId);

      try {
        const result = await fetch(getAjaxUrl(action), {
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
    }
  ),
  commentsRequest: thunk(async ({ updateComments }, _, { getStoreState }) => {
    const {
      components: {
        task: { databaseId: taskDatabaseId },
      },
    } = getStoreState() as IStoreModel;
    const { request } = await import("graphql-request");
    const {
      comments: { nodes: commentCollection },
    } = await request(
      process.env.GraphQLServer,
      commentGraphqlQuery.commentsRequest,
      {
        taskId: taskDatabaseId,
      }
    );

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
      const result = await fetch(getAjaxUrl(action), {
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
    async ({ updateStatus }, { status }, { getStoreState }) => {
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
        const result = await fetch(getAjaxUrl(action), {
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
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
};

const taskModel = { ...taskState, ...taskActions, ...taskThunks };

export default taskModel;
