import { ITaskListItemState } from "../model.typing";

const taskState: ITaskListItemState = {
  id: "",
  title: "",
  slug: "",
  content: "",
  date: "1970-01-01",
  dateGmt: "1970-01-01",
  viewsCount: 0,
  doerCandidatesCount: 0,
  reviewsDone: false,
  nextTaskSlug: "",
  cover: null,
  coverImgSrcLong: "",
  files: [],
};

export const queriedFields = Object.keys(taskState) as Array<
  keyof ITaskListItemState
>;
