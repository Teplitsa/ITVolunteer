import { action, thunk, thunkOn } from "easy-peasy";
import {
  IStoreModel,
  INewsListModel,
  INewsListState,
  INewsListActions,
  INewsListThunks,
} from "../model.typing";
import { graphqlQuery as archiveGraphqlQuery } from "../archive-model";

const newsListState: INewsListState = {
  items: [],
  isNewsListLoaded: false,
  hasNextPage: true,
  lastViewedListItem: null,
};

export const graphqlQuery = {};

const newsListActions: INewsListActions = {
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

const newsListThunks: INewsListThunks = {
  loadMoreNewsRequest: thunk(
    async (actions, _, { getStoreState }) => {
      const {
        components: {
          newsList: { lastViewedListItem: newsLastViewedListItem },
        },
        entrypoint: {
          archive: { lastViewedListItem: archiveLastViewedListItem },
        },
      } = getStoreState() as IStoreModel;
      const { request } = await import("graphql-request");
      const { posts: news } = await request(
        process.env.GraphQLServer,
        archiveGraphqlQuery.getPosts,
        {
          first: 20,
          after: newsLastViewedListItem ? newsLastViewedListItem : archiveLastViewedListItem,
        }
      );

      return {
        archiveState: {
          hasNextPage: news.pageInfo.hasNextPage,
          lastViewedListItem: news.pageInfo.endCursor,
        },
        newsListState: {
          items: news.edges.map(({ node: item }) => item),
        },
      };
    }
  ),
  onLoadMoreNewsRequestSuccess: thunkOn(
    (actions) => actions.loadMoreNewsRequest.successType,
    ({ appendNewsList, setNewsListLoadMoreState }, { result }) => {
      const {
        archiveState,
        newsListState: { items },
      } = result;

      setNewsListLoadMoreState(archiveState);
      appendNewsList(items);
    }
  ),
};

const newsListModel: INewsListModel = {
  ...newsListState,
  ...newsListActions,
  ...newsListThunks,
};

export default newsListModel;
