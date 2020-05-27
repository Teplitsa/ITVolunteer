import { ReactElement } from "react";

const TaskListFilter: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="task-list-filter">
      <div className="filter-explain">
        Выберите категории задач, которые вам подоходят
      </div>
    </section>
  );
};

export default TaskListFilter;
