import { ReactElement } from "react";

const TaskSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="task-skeleton">
      <div className="task-skeleton__inner">
        <div className="task-skeleton__sidebar">
          <div className="task-skeleton__column-title">Помощь нужна</div>
          <div className="task-skeleton__column-mock" />
        </div>
        <div className="task-skeleton__content">
          <div className="task-skeleton__column-title">Задача</div>
          <div className="task-skeleton__column-mock" />
        </div>
      </div>
    </div>
  );
};

export default TaskSkeleton;
