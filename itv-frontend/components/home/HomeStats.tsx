import { ReactElement } from "react";

const HomeStats: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-stats">
      <div className="home-stats__item">
        <div className="home-stats__item-value">6000</div>
        <div className="home-stats__item-label">Участников</div>
      </div>
      <div className="home-stats__item">
        <div className="home-stats__item-value">1265</div>
        <div className="home-stats__item-label">Решеных задач</div>
      </div>
      <div className="home-stats__item">
        <div className="home-stats__item-value home-stats__item-value_primary">10</div>
        <div className="home-stats__item-label">Задач ожидают решения</div>
      </div>
    </section>
  );
};

export default HomeStats;
