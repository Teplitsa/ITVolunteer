import { ReactElement } from "react";

const basicStats: {
  activeMemebersCount: number;
  closedTasksCount: number;
  workTasksCount: number;
  newTasksCount: number;
} = {
  activeMemebersCount: 1,
  closedTasksCount: 2,
  workTasksCount: 3,
  newTasksCount: 4,
};

const Stats: React.FunctionComponent = ({ children }): ReactElement => {
  const {
    activeMemebersCount,
    closedTasksCount,
    workTasksCount,
    newTasksCount,
  } = basicStats;
  return (
    <div className="col-stats">
      <h3>Статистика проекта</h3>
      <div className="stats">
        <p>{`Всего участников: ${activeMemebersCount}`}</p>
        <p>{`Всего задач: ${
          closedTasksCount + workTasksCount + newTasksCount
        }`}</p>
        <p>{`Задач решено: ${closedTasksCount}`}</p>
      </div>
    </div>
  );
};

export default Stats;
