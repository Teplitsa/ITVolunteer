import { ITaskListItemState } from "../model.typing";

const taskState: ITaskListItemState = {
  id: "",
  title: "",
  slug: "",
  content: "",
};

export const queriedFields = Object.keys(taskState) as Array<
  keyof ITaskListItemState
>;
