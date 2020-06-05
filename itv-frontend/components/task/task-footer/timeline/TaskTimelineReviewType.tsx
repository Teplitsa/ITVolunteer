import { ReactElement } from "react";
import TaskTimelineReviewForAuthor from "./TaskTimelineReviewForAuthor";
import TaskTimelineReviewForDoer from "./TaskTimelineReviewForDoer";
import TaskTimelineReviewWrite from "./TaskTimelineReviewWrite";

const TaskTimelineReviewType: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="details actions">
      <TaskTimelineReviewForAuthor />
      <TaskTimelineReviewForDoer />
      <TaskTimelineReviewWrite />
    </div>
  );
};

export default TaskTimelineReviewType;
