import { IArchiveModel, IArchiveState, IArchiveActions, PostTypeWithArchive } from "./model.typing";
import { action, thunkOn } from "easy-peasy";
import {
  queriedFields as taskQueriedFields,
  graphqlFeaturedImage,
  graphqlTags,
} from "./task-model/task-model";
import { queriedFields as newsQueriedFields } from "./news-model/news-item-model";
import { queriedFields as authorQueriedFields } from "./task-model/task-author";
import { capitalize } from "../utilities/utilities";

const archiveState: IArchiveState = {
  entrypoint: "",
  hasNextPage: true,
  lastViewedListItem: null,
  seo: {
    canonical: "",
    title: "",
    metaDesc: "",
    focuskw: "",
    metaRobotsNoindex: "",
    metaRobotsNofollow: "",
    opengraphAuthor: "",
    opengraphDescription: "",
    opengraphTitle: "",
    opengraphImage: null,
    opengraphUrl: "",
    opengraphSiteName: "",
    opengraphPublishedTime: "",
    opengraphModifiedTime: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: null,
  },
};

export const queriedFields: Array<string> = ["hasNextPage", "endCursor"];

const withPostType = (
  postType: PostTypeWithArchive,
  listItemFields: Array<string>,
  isSearch?: boolean
): string => {
  return `
  query Get${capitalize(postType)}List($first: Int, $after: String${
    isSearch ? ", $searchPhrase: String" : ""
  }) {
    ${postType}s(first: $first, after: $after${
    isSearch ? ", where: { search: $searchPhrase}" : ""
  }) {
      pageInfo {
        ${queriedFields.join("\n")}
      }
      edges {
        cursor
        node {
          ${listItemFields.join("\n")}
          ${isSearch ? `author {\n${authorQueriedFields.join("\n")}}` : ""}
          ${isSearch ? graphqlFeaturedImage : ""}
          ${isSearch ? graphqlTags : ""}
          ${
            postType == "post"
              ? " featuredImage { mediaItemUrl mediaDetails { sizes { sourceUrl name } } } "
              : ""
          }
        }
      }
    }
  }`;
};

export const graphqlQuery = {
  getPosts: withPostType("post", newsQueriedFields),
  getTasks: withPostType("task", taskQueriedFields),
  taskSearch: withPostType("task", taskQueriedFields, true),
};

const archiveActions: IArchiveActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, archiveState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  onLoadMoreTasksRequestSuccess: thunkOn(
    (actions, storeActions) => storeActions.components.taskList.loadMoreTasksRequest.successType,
    ({ setState }, { result }) => {
      const { archiveState } = result;

      setState(archiveState);
    }
  ),
};

const archiveModel: IArchiveModel = { ...archiveState, ...archiveActions };

export default archiveModel;
