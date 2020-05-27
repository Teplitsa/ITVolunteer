import { ReactElement } from "react";

const TaskListStats: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="stats">
      <span>Ожидают волонтеров: 54</span>
      <span>В работе: 78</span>
      <span className="active">Решено: 986</span>
    </div>
  );
};

export default TaskListStats;
