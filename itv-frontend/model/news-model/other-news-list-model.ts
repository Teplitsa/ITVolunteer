import { action, thunk, thunkOn } from "easy-peasy";
import {
  IStoreModel,
  INewsListModel,
  INewsListState,
  INewsListActions,
  IOtherNewsListThunks,
  IOtherNewsListModel,
} from "../model.typing";
import { graphqlQuery as archiveGraphqlQuery } from "../archive-model";

const newsListState: INewsListState = {
  items: [],
  isNewsListLoaded: false,
};

export const graphqlQuery = {};

const otherNewsListActions: INewsListActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, newsListState);
  }),
  setState: action((prevState, newState) => {
    if (newState.items) {
      newState = { ...newState, isNewsListLoaded: true };
    }
    Object.assign(prevState, newState);
  }),
  resetNewsListLoaded: action((state) => {
    state.isNewsListLoaded = false;
  }),
  appendNewsList: action((state, newItems) => {
    state.items = [...state.items, ...newItems];
  }),
  setNewsList: action((state, payload) => {
    state.items = payload;
    state.isNewsListLoaded = true;
  }),
  setNewsListLoadMoreState: action((state, payload) => {
    state.hasNextPage = payload.hasNextPage;
    state.lastViewedListItem = payload.lastViewedListItem;
  })
};

const otherNewsListThunks: IOtherNewsListThunks = {
  loadOtherNewsRequest: thunk(
    async (actions, {excludeNewsItem}, { getStoreState }) => {

      const { request } = await import("graphql-request");
      const { posts: news } = await request(
        process.env.GraphQLServer,
        archiveGraphqlQuery.getPosts,
        {
          first: 5,
        }
      );

      return {
        archiveState: {
          hasNextPage: news.pageInfo.hasNextPage,
        },
        newsListState: {
          items: news.edges
            .map(({ node: item }) => item)
            .filter((item) => item.id != excludeNewsItem.id)
            .slice(0, 4),
        },
      };
    }
  ),
  onLoadOtherNewsRequestSuccess: thunkOn(
    (actions) => actions.loadOtherNewsRequest.successType,
    ({ setNewsList }, { result }) => {
      const {
        newsListState: { items },
      } = result;

      setNewsList(items);
    }
  ),
};

const otherNewsListModel: IOtherNewsListModel = {
  ...newsListState,
  ...otherNewsListActions,
  ...otherNewsListThunks,
};

export default otherNewsListModel;
