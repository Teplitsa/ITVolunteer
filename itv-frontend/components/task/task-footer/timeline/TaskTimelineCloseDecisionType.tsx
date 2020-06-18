import { ReactElement } from "react";
import { useStoreState } from "../../../../model/helpers/hooks";
import UserCardSmall from "../../../UserCardSmall";

const TaskTimelineCloseDecisionType: React.FunctionComponent<{
  id: number;
  status: string;
  message: string;
}> = ({ id, status, message }): ReactElement => {
  const author = useStoreState((state) => state.components.task.author);

  return (
    <div className="details">
      <UserCardSmall {...author} />
      {!!message && 
      <div className="comment">{message}</div>
      }
    </div>
  );
};

export default TaskTimelineCloseDecisionType;
