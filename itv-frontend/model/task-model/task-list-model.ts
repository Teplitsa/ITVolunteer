import { action, thunk, thunkOn } from "easy-peasy";
import {
  IStoreModel,
  ITaskListModel,
  ITaskListState,
  ITaskListActions,
  ITaskListThunks,
} from "../model.typing";
import { graphqlQuery as archiveGraphqlQuery } from "../archive-model";

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
    state.isTaskListLoaded = false;
  }),
  appendTaskList: action((state, newItems) => {
    state.items = [...state.items, ...newItems];
  }),
  setTaskList: action((state, payload) => {
    state.items = payload;
    state.isTaskListLoaded = true;
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
          first: 50,
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
