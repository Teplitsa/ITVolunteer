import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import withFadeIn from "../hoc/withFadeIn";
import CoreParagraphBlock from "../gutenberg/CoreParagraphBlock";

const HomeStats: React.FunctionComponent = (): ReactElement => {
  const stats = useStoreState(state => state.components.homePage.stats);

  return (
    <section className="home-stats">
      <div className="home-stats__item">
        <div className="home-stats__item-value">
          {withFadeIn({
            component: Link,
            children: <a className="text-default">{stats?.member.total}</a>,
            href: "/members",
          })}
        </div>
        <div className="home-stats__item-label">Участников</div>
      </div>
      <div className="home-stats__item">
        <div className="home-stats__item-value">
          {withFadeIn({
            component: Link,
            children: <a className="text-default">{stats?.task.total.closed}</a>,
            href: "/tasks/closed",
          })}
        </div>
        <div className="home-stats__item-label">Решеных задач</div>
      </div>
      <div className="home-stats__item">
        <div className="home-stats__item-value home-stats__item-value_primary">
          {withFadeIn({
            component: Link,
            children: <a>{stats?.task.total.publish}</a>,
            href: "/tasks/publish",
          })}
        </div>
        <div className="home-stats__item-label">Задач ожидают решения</div>
      </div>
    </section>
  );
};

export default HomeStats;
