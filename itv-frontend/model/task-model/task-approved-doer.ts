import { ITaskApprovedDoer } from "../model.typing";

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
};

export const queriedFields = Object.keys(taskApprovedDoer) as Array<keyof ITaskApprovedDoer>;
