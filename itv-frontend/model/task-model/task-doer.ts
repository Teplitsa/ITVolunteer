import { ITaskDoer } from "../model.typing";
import * as utils from "../../utilities/utilities";

const taskDoer: ITaskDoer = {
  id: "",
  databaseId: 0,
  fullName: "",
  slug: "",
  profileURL: "",
  itvAvatar: "",
  solvedTasksCount: 0,
  doerReviewsCount: 0,
  isPasekaMember: false,
  partnerIcon: null,
};

export const queriedFields = utils.customizeGraphQLQueryFields(taskDoer, {
  partnerIcon: "{url title description}"
}) as Array<keyof ITaskDoer>;

export const graphqlQuery = {
  doersRequest: `
    query TaskDoers ($taskGqlId: ID!) {
        taskDoers(taskGqlId: $taskGqlId) {
            ${queriedFields.join("\n")}
        }
    }`,
};
