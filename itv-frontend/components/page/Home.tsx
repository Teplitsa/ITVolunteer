import { ReactElement, useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";

import NewsList from "../news/NewsList";
import { TaskListItemHome } from "../task-list/TaskListItem";
import {
  ITaskState
} from "../../model/model.typing";

import headerImage from "../../assets/img/home-head-pic.svg";

const Home: React.FunctionComponent = (): ReactElement => {
  const homePage = useStoreState((state) => state.components.homePage);
  const { title, content } = useStoreState((state) => state.components.homePage);
  const { isLoggedIn } = useStoreState((state) => state.session);

  return (
    <>
      <section className="home-header">
        <div className="home-section-inner">
          <div className="home-header__cta">
            <h1 dangerouslySetInnerHTML={{ __html: title }} />
            <div className="home-header__cta-text" dangerouslySetInnerHTML={{ __html: content }} />
            <div className="home-header__actions">
              <Link href={isLoggedIn ? "/task-actions" : "/login"}>
                <a className="home-header__action-primary">Создать задачу</a>            
              </Link>
              <Link href={"/about"}>
                <a className="home-header__action-secondary">Как это работает</a>
              </Link>
            </div>
          </div>
          <div className="home-header__pic-container">
            <div className="home-header__pic-overflow-fix-wrapper">
              <div className="home-header__pic" />
            </div>
          </div>
        </div>
      </section>
      <section className="home-stats">
        <div className="home-section-inner">
          <div className="home-stats__content">
            <div className="home-stats__list">
            {[
              {value: homePage.stats?.publish, title: "Задачи ожидают волонтеров"},
              {value: homePage.stats?.in_work, title: "Задачи сейчас в работе"},
              {value: homePage.stats?.closed, title: "Решеных задач"},
            ].map((statsItem, index) => {
              return (
                <div className="home-stats__item" key={`home-stats-item-${index}`}>
                  <div className="home-stats__item-value">{statsItem.value}</div>
                  <div className="home-stats__item-title">{statsItem.title}</div>
                </div>
              )
            })}
            </div>
          </div>
        </div>
      </section>
      <section className="home-tasks home-list-section">
        <div className="home-section-inner">
          <div className="home-list-section__title">Открытые задачи</div>
          <div className="home-list-section__list">
            <div className="task-list">
              {homePage.taskList.map((task, index) => (
                <Fragment key={`home-taskListItem-${task.id}-${index}`}>
                  <TaskListItemHome                    
                    index={index}
                    task={task as ITaskState}
                  />
                  {!!(index % 2) &&
                    <div className="task-list-item-separator">
                      <div className="task-list-item-separator__line" />
                    </div>
                  }
                </Fragment>
              ))}
            </div>
          </div>
          <div className="home-list-section__footer">
            <Link href={"/tasks"}>
              <a className="home-list-section__footer-link">Все задачи</a>
            </Link>
          </div>
        </div>
      </section>
      <section className="home-news home-list-section">
        <div className="home-section-inner">
          <div className="home-list-section__title">Новости</div>
          <div className="home-list-section__list">
            <NewsList {...homePage.newsList} />
          </div>
          <div className="home-list-section__footer">
            <Link href={"/news"}>
              <a className="home-list-section__footer-link">Все новости</a>
            </Link>
          </div>
        </div>
      </section>
      <section className="home-footer">
        <div className="home-section-inner">
          <div className="home-footer__pic" />
          <div className="home-footer__cta">
            <h2>Нужна помощь с созданием сайта, продвижением сайта в социальных сетях или созданием дизайна?</h2>
            <div className="home-footer__cta-action">
              {isLoggedIn &&
                <Link href="/task-actions">
                  <a className="home-footer__action-primary">Создать задачу</a>            
                </Link>
              }
              {!isLoggedIn &&
                <Link href="/registration">
                  <a className="home-footer__action-primary">Зарегистрироваться</a>            
                </Link>
              }
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
