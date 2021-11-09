import { ITaskAuthor } from "../model.typing";
import * as utils from "../../utilities/utilities";

const taskAuthor: ITaskAuthor = {
  id: "",
  databaseId: 0,
  slug: "",
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
  facebook: "",
  instagram: "",
  vk: "",
  registrationDate: 0,
};

export const queriedFields = utils.customizeGraphQLQueryFields(taskAuthor, {partnerIcon: "{url title description}"}) as Array<keyof ITaskAuthor>;
