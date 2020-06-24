import { IPageModel, IPageState, IPageActions, PostType } from "./model.typing";
import { action } from "easy-peasy";
import { capitalize } from "../utilities/utilities";

const pageState: IPageState = {
  slug: "",
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

export const queriedFields = Object.keys(pageState).map((key) => {
  if (key === "seo") {
    return `${key} {
      ${Object.keys(pageState.seo)
        .map((imageKey) => {
          if (/\w+Image/.test(imageKey)) {
            const imageProps: Array<string> = [
              "sourceUrl",
              "srcSet",
              "altText",
            ];
            return `${imageKey} {
            ${imageProps.join("\n")}
          }`;
          }
          return imageKey;
        })
        .join("\n")}
    }`;
  }
  return key;
}) as Array<keyof IPageState | string>;

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
