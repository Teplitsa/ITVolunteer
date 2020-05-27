import { IPageModel, IPageState, IPageActions, PostType } from "./model.typing";
import { action } from "easy-peasy";
import { capitalize } from "../utilities/utilities";

const pageState: IPageState = {
  slug: "",
};

export const queriedFields = Object.keys(pageState) as Array<keyof IPageState>;

const withPostType = (
  postType: PostType,
  fields: string = queriedFields.join("\n")
): string => {
  return `
  query Get${capitalize(postType)}($slug: String!) {
    ${postType}By(slug: $slug) {
      ${fields}
    }
  }`;
};

export const graphqlQuery = {
  getPageBySlug: withPostType("page"),
  getPostBySlug: withPostType("post"),
  getTaskBySlug: withPostType("task"),
};

const pageActions: IPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, pageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const pageModel: IPageModel = { ...pageState, ...pageActions };

export default pageModel;
