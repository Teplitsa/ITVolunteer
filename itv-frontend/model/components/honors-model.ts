import {
  IHonorsPageModel,
  IHonorsPageState,
  IHonorsPageActions,
} from "../model.typing";
import { queriedFields as paragraphQueriedFields } from "../gutenberg/paragraph-model";
import { queriedFields as mediaTextQueriedFields } from "../gutenberg/media-text-model";
import { action } from "easy-peasy";
import { withPostType } from "../page-model";

const honorsPageState: IHonorsPageState = {
  id: "",
  databaseId: 0,
  title: "",
  slug: "",
  blocks: null,
};

export const queriedFields = Object.keys(honorsPageState).map((field) => {
  if (field === "blocks") {
    return `
    blocks {
      ${paragraphQueriedFields}
      ${mediaTextQueriedFields}
    }`;
  }
  return field;
}) as Array<keyof IHonorsPageState | string>;

export const graphqlQuery = withPostType({
  postType: "page",
  fields: queriedFields.join("\n"),
  queryVar: "uri",
});

const honorsPageActions: IHonorsPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, honorsPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const honorsModel: IHonorsPageModel = {
  ...honorsPageState,
  ...honorsPageActions,
};

export default honorsModel;
