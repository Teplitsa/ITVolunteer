import { ReactElement, useEffect } from "react";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import TaskTimelineItem from "./TaskTimelineItem";

const TaskTimeline: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn } = useStoreState((state) => state.session);
  const { timeline } = useStoreState((state) => state.components.task);
  const { timelineRequest, reviewsRequest } = useStoreActions(
    (actions) => actions.components.task
  );

  useEffect(() => {
    isLoggedIn && timelineRequest();
    isLoggedIn && reviewsRequest();
  }, [isLoggedIn]);

  return (
    isLoggedIn && (
      <div className="timeline">
        <h3>Календарь задачи</h3>
        <div className="timeline-list">
          {timeline?.map((timelineItem) => (
            <TaskTimelineItem key={timelineItem.id} {...timelineItem} />
          ))}
        </div>
      </div>
    )
  );
};

export default TaskTimeline;
