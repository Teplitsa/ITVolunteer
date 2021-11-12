import { ReactElement, useEffect, useState } from "react";


const Stats: React.FunctionComponent = (): ReactElement => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    try {
      fetch(`${process.env.BaseUrl}/api/v1/cache/stats`)
        .then((response) => {
          console.log(response);
          response.json()
            .then((statsData) => {
              console.log(statsData);
              setStats(statsData);
            });
        });

    } catch (error) {
      console.error("Failed to fetch the stats.");
    }

  }, []);

  return (
    <div className="col-stats">
      <h3>Статистика проекта</h3>
      {!!stats &&
        <div className="stats">
          <p>{`Всего участников: ${stats?.member.total}`}</p>
          <p>{`Задач решено: ${stats?.task.total.closed}`}</p>
          <p>{`Ожидают решения: ${stats?.task.total.publish}`}</p>
        </div>
      }
    </div>
  );
};

export default Stats;
