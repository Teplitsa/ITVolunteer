import { ITaskApprovedDoer } from "../model.typing";
import * as utils from "../../utilities/utilities";

const taskApprovedDoer: ITaskApprovedDoer = {
  id: "",
  databaseId: 0,
  fullName: "",
  slug: "",
  itvAvatar: "",
  profileURL: "",
  solvedTasksCount: 0,
  doerReviewsCount: 0,
  isPasekaMember: false,
  partnerIcon: null,
};

export const queriedFields = utils.customizeGraphQLQueryFields(taskApprovedDoer, {
  partnerIcon: "{url title description}"
}) as Array<keyof ITaskApprovedDoer>;