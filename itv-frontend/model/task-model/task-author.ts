import { ITaskAuthor } from "../model.typing";

const taskAuthor: ITaskAuthor = {
  id: "",
  databaseId: 0,
  fullName: "",
  itvAvatar: "",
  profileURL: "",
  authorReviewsCount: 0,
  doerReviewsCount: 0,
  organizationName: "",
  organizationDescription: "",
  organizationLogo: "",
  isPartner: false,
  memberRole: "",
};

export const queriedFields = Object.keys(taskAuthor) as Array<
  keyof ITaskAuthor
>;
