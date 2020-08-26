import { INewsItemModel, INewsItemState, INewsItemActions, INewsItemThunks, PostType } from "../model.typing";
import { action } from "easy-peasy";
import { capitalize } from "../../utilities/utilities";

const newsItemState: INewsItemState = {
  id: "",
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  date: "1970-01-01",
  dateGmt: "1970-01-01",
  featuredImage: {
    mediaItemUrl: "",
    mediaDetails: {
      sizes: [],
    }
  },
};

export const queriedFields = Object.keys(newsItemState).filter((key) => ["featuredImage"].findIndex(excludeKey => excludeKey == key) == -1).map((key) => {
  if (key === "seo") {
    return `${key} {
      ${Object.keys(newsItemState.seo)
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
}) as Array<keyof INewsItemState | string>;

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
      featuredImage { mediaItemUrl mediaDetails { sizes { sourceUrl name } } }
    }
  }`;
};

export const graphqlQuery = {
  getBySlug: withPostType({ postType: "post" }),
};

const newsItemActions: INewsItemActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, newsItemState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const newsItemThunks: INewsItemThunks = {
};

const newsItemModel: INewsItemModel = { 
  ...newsItemState, 
  ...newsItemActions, 
  ...newsItemThunks 
};

export default newsItemModel;
