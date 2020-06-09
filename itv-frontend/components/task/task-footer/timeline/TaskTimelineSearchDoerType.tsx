import { ReactElement } from "react";
import { useStoreState } from "../../../../model/helpers/hooks";
import UserCardSmall from "../../../UserCardSmall";

const TaskTimelineSearchDoerType: React.FunctionComponent = (): ReactElement => {
  const author = useStoreState((state) => state.components.task.author);

  return (
    <div className="details">
      <UserCardSmall {...author} />
    </div>
  );
};

export default TaskTimelineSearchDoerType;