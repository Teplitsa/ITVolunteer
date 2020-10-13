import { ReactElement } from "react";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import { ITaskCommentAuthor } from "../../../../model/model.typing";
import UserCardSmall from "../../../UserCardSmall";

const TaskTimelineWorkType: React.FunctionComponent<{
  status: string;
  doer: ITaskCommentAuthor;
}> = ({
  doer,
}): ReactElement => {

  return (
    <>
      <div className="details">
        <UserCardSmall {...doer} />
      </div>
    </>
  );
};

export default TaskTimelineWorkType;
