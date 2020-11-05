import { ReactElement } from "react";
import TaskList from "./partials/TaskList";
import TaskListFilter from "./partials/TaskListFilter";

const TaskListSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="task-list-skeleton">
      <div className="task-list-skeleton__inner">
        <div className="task-list-skeleton__top">
          <div className="task-list-skeleton__title" />
          <div className="task-list-skeleton__stats" />
        </div>
        <TaskListFilter />
        <TaskList />
      </div>
    </div>
  );
};

export default TaskListSkeleton;
