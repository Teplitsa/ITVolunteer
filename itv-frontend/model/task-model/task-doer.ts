import { ITaskDoer } from "../model.typing";

const taskDoer: ITaskDoer = {
  id: "",
  databaseId: 0,
  fullName: "",
  profileURL: "",
  itvAvatar: "",
  solvedTasksCount: 0,
  doerReviewsCount: 0,
  isPasekaMember: false,
};

export const queriedFields = Object.keys(taskDoer) as Array<keyof ITaskDoer>;

export const graphqlQuery = {
  doersRequest: `
    query TaskDoers ($taskGqlId: ID!) {
        taskDoers(taskGqlId: $taskGqlId) {
            ${queriedFields.join("\n")}
        }
    }`,
};
