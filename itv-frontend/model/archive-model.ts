import {
  IArchiveModel,
  IArchiveState,
  IArchiveActions,
  PostTypeWithArchive,
} from "./model.typing";
import { action } from "easy-peasy";
import { queriedFields as taskQueriedFields } from "./task-model/task-model";
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
  listItemFields: Array<string>
): string => {
  return `
  query Get${capitalize(postType)}List($first: Int, $after: String) {
    ${postType}s(first: $first, after: $after) {
      pageInfo {
        ${queriedFields.join("\n")}
      }
      edges {
        cursor
        node {
          ${listItemFields.join("\n")}
        }
      }
    }
  }`;
};

export const graphqlQuery = {
  getPosts: withPostType("post", ["id", "title"]),
  getTasks: withPostType("task", taskQueriedFields),
};

const archiveActions: IArchiveActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, archiveState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const archiveModel: IArchiveModel = { ...archiveState, ...archiveActions };

export default archiveModel;
