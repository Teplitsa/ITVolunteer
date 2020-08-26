import { IPageModel, IPageState, IPageActions, PostType } from "./model.typing";
import { action } from "easy-peasy";
import { capitalize } from "../utilities/utilities";

const textPageState: IPageState = {
  slug: "",
  title: "",
  content: "",
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

export const queriedFields = Object.keys(textPageState).map((key) => {
  if (key === "seo") {
    return `${key} {
      ${Object.keys(textPageState.seo)
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

export const withPostType = ({
  postType,
  fields = queriedFields.join("\n"),
  queryVar = "slug"
}: {
  postType: PostType;
  fields?: string;
  queryVar?: string;
}): string => {
  return `
  query Get${capitalize(postType)}($${queryVar}: String!) {
    ${postType}By(${queryVar}: $${queryVar}) {
      ${fields}
    }
  }`;
};

export const graphqlQuery = {
  getPageBySlug: withPostType({ postType: "page", queryVar: "uri" }),
  getPostBySlug: withPostType({ postType: "post" }),
  getTaskBySlug: withPostType({ postType: "task" }),
};

const textPageActions: IPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, textPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const textPageModel: IPageModel = { ...textPageState, ...textPageActions };

export default textPageModel;
