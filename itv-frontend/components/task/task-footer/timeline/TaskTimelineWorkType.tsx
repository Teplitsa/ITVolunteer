import { ReactElement } from "react";
import { ITaskCommentAuthor } from "../../../../model/model.typing";
import UserCardSmall from "../../../UserCardSmall";

const TaskTimelineWorkType: React.FunctionComponent<ITaskCommentAuthor> = (
  user
): ReactElement => {
  return (
    <div className="details">
      <UserCardSmall {...user} />
    </div>
  );
};

export default TaskTimelineWorkType;
