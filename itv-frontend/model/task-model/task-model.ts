import { action, thunk } from "easy-peasy";
import {
  IStoreModel,
  ITaskState,
  ITaskActions,
  ITaskThunks,
} from "../model.typing";
import { queriedFields as approvedDoerQueriedFields } from "./task-approved-doer";
import { queriedFields as authorQueriedFields } from "./task-author";
import { graphqlQuery as doerGraphqlQuery } from "./task-doer";
import { graphqlQuery as commentGraphqlQuery } from "./task-comment";
import { getAjaxUrl, stripTags } from "../../utilities/utilities";

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
  updateApprovedDoer: action((taskState, approvedDoer) => {
    Object.assign(taskState, { approvedDoer });
  }),
  updateDoers: action((taskState, doers) => {
    Object.assign(taskState, { doers });
  }),
  updateComments: action((taskState, comments) => {
    Object.assign(taskState, { comments });
  }),
  likeComment: action((taskState, { commentId, likesCount }) => {
    const comments = taskState.comments;

    if (!Array.isArray(comments)) return taskState;

    const commentIndex = comments.findIndex(
      (comment) => comment.id === commentId
    );

    if (commentIndex < 0) return taskState;

    comments[commentIndex].likesCount = likesCount;
    comments[commentIndex].likeGiven = true;
  }),
};

const taskThunks: ITaskThunks = {
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
    async (
      actions,
      { action, taskId, doer, callbackFn },
      { getStoreState }
    ) => {
      const {
        session: { validToken: token },
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
          callbackFn();
        }
      } catch (error) {
        console.error(error);
      }
    }
  ),
  commentsRequest: thunk(async ({ updateComments }, taskDatabaseId) => {
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
  doersRequest: thunk(async ({ updateDoers }, id) => {
    const { request } = await import("graphql-request");
    const { taskDoers: doers } = await request(
      process.env.GraphQLServer,
      doerGraphqlQuery.doersRequest,
      {
        taskGqlId: id,
      }
    );

    updateDoers(doers);
  }),
  statusChangeRequest: thunk(
    async ({ updateStatus }, { databaseId, status }, { getStoreState }) => {
      const {
        session: { validToken: token },
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
      // const { GraphQLClient } = await import("graphql-request");
      // const { v4: uuidv4 } = await import("uuid");
      // const updateStatusQuery = graphqlQuery.updateStatus;
      // const graphQLClient = new GraphQLClient(process.env.GraphQLServer, {
      //   headers: {
      //     authorization: `Bearer ${token}`,
      //   },
      // });

      // try {
      //   const {
      //     updateTask: {
      //       task: { status: updatedStatus },
      //     },
      //   } = await graphQLClient.request(updateStatusQuery, {
      //     input: {
      //       clientMutationId: uuidv4(),
      //       id,
      //       status: status.toUpperCase(),
      //     },
      //   });
      //   updateStatus({ status: updatedStatus });
      // } catch (error) {
      //   console.error(error.message);
      // }
    }
  ),
};

const taskModel = { ...taskState, ...taskActions, ...taskThunks };

export default taskModel;
