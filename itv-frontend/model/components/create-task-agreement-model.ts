import {
  ICreateTaskAgreementPageModel,
  ICreateTaskAgreementPageState,
  ICreateTaskAgreementPageActions,
} from "../model.typing";
import { queriedFields as paragraphQueriedFields } from "../gutenberg/paragraph-model";
import { queriedFields as headingQueriedFields } from "../gutenberg/heading-model";
import { action } from "easy-peasy";
import { withPostType } from "../page-model";

const createTaskAgreementPageState: ICreateTaskAgreementPageState = {
  id: "",
  databaseId: 0,
  title: "",
  slug: "",
  blocks: null,
};

export const queriedFields = Object.keys(createTaskAgreementPageState).map((field) => {
  if (field === "blocks") {
    return `
    blocks {
      ${paragraphQueriedFields}
      ${headingQueriedFields}
    }`;
  }
  return field;
}) as Array<keyof ICreateTaskAgreementPageState | string>;

export const graphqlQuery = withPostType({
  postType: "page",
  fields: queriedFields.join("\n"),
  queryVar: "uri",
});

const createTaskAgreementPageActions: ICreateTaskAgreementPageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, createTaskAgreementPageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const createTaskAgreementPageModel: ICreateTaskAgreementPageModel = {
  ...createTaskAgreementPageState,
  ...createTaskAgreementPageActions,
};

export default createTaskAgreementPageModel;
