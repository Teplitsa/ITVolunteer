import {
  IPasekaPageModel,
  IPasekaPageState,
  IPasekaPageActions,
} from "../model.typing";
import { action } from "easy-peasy";
import { withPostType } from "../page-model";

const pasekaPageState: IPasekaPageState = {
  id: "",
  databaseId: 0,
  title: "",
  slug: "",
  content: "",
};

export const queriedFields = Object.keys(pasekaPageState) as Array<
  keyof IPasekaPageState
>;

export const graphqlQuery = withPostType({
  postType: "page",
  fields: queriedFields.join("\n"),
  queryVar: "uri",
});

const pasekaPageActions: IPasekaPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, pasekaPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const archiveModel: IPasekaPageModel = {
  ...pasekaPageState,
  ...pasekaPageActions,
};

export default archiveModel;
