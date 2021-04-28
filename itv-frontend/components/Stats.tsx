import { ReactElement, useEffect, useState } from "react";
import { IFetchResult } from "../model/model.typing";
import * as utils from "../utilities/utilities";

const basicStats: {
  activeMemebersCount: number;
  closedTasksCount: number;
  workTasksCount: number;
  newTasksCount: number;
} = {
  activeMemebersCount: null,
  closedTasksCount: null,
  workTasksCount: null,
  newTasksCount: null,
};

const Stats: React.FunctionComponent = (): ReactElement => {
  const [stats, setStats] = useState(basicStats);

  useEffect(() => {
    const formData = new FormData();

    const action = "get_general_stats";
    fetch(utils.getAjaxUrl(action), {
      method: "post",
      body: formData,
    })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "fail") {
            return utils.showAjaxError({ message: result.message });
          }

          setStats(result.stats);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }, []);

  return (
    <div className="col-stats">
      <h3>Статистика проекта</h3>
      <div className="stats">
        <p>{`Всего участников: ${stats.activeMemebersCount}`}</p>
        <p>{`Всего задач: ${
          stats.closedTasksCount + stats.workTasksCount + stats.newTasksCount
        }`}</p>
        <p>{`Задач решено: ${stats.closedTasksCount}`}</p>
      </div>
    </div>
  );
};

export default Stats;
