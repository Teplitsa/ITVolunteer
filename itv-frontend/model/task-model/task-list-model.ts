import { action, thunk, thunkOn } from "easy-peasy";
import {
  IStoreModel,
  ITaskListModel,
  ITaskListState,
  ITaskListActions,
  ITaskListThunks,
} from "../model.typing";
import { graphqlQuery as archiveGraphqlQuery } from "../archive-model";

export const taskListLimit = 50;

const taskListState: ITaskListState = {
  items: [],
  isTaskListLoaded: false,
};

export const graphqlQuery = {};

const taskListActions: ITaskListActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, taskListState);
  }),
  setState: action((prevState, newState) => {
    if (newState.items) {
      newState = { ...newState, isTaskListLoaded: true };
    }
    Object.assign(prevState, newState);
  }),
  resetTaskListLoaded: action((state) => {
    // console.log("resetTaskListLoaded...");
    state.isTaskListLoaded = false;
  }),
  appendTaskList: action((state, newItems) => {
    state.items = [...state.items, ...newItems];
  }),
  setTaskList: action((state, payload) => {
    state.items = payload;
    state.isTaskListLoaded = true;
  }),
  setIsTaskListLoaded: action((state, payload) => {
    // console.log("setIsTaskListLoaded payload:", payload);
    state.isTaskListLoaded = payload;
  }),
};

const taskListThunks: ITaskListThunks = {
  loadMoreTasksRequest: thunk(
    async (actions, { searchPhrase }, { getStoreState }) => {
      const {
        entrypoint: {
          archive: { lastViewedListItem },
        },
      } = getStoreState() as IStoreModel;
      const { request } = await import("graphql-request");
      const { tasks: searchResults } = await request(
        process.env.GraphQLServer,
        archiveGraphqlQuery.taskSearch,
        {
          first: taskListLimit,
          after: lastViewedListItem,
          searchPhrase,
        }
      );

      return {
        archiveState: {
          hasNextPage: searchResults.pageInfo.hasNextPage,
          lastViewedListItem: searchResults.pageInfo.endCursor,
        },
        taskListState: {
          items: searchResults.edges.map(({ node: item }) => item),
        },
      };
    }
  ),
  onLoadMoreTasksRequestSuccess: thunkOn(
    (actions) => actions.loadMoreTasksRequest.successType,
    ({ appendTaskList }, { result }) => {
      const {
        taskListState: { items },
      } = result;

      appendTaskList(items);
    }
  ),
};

const taskListModel: ITaskListModel = {
  ...taskListState,
  ...taskListActions,
  ...taskListThunks,
};

export default taskListModel;
