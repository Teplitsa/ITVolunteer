import { ReactElement, useEffect, Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState } from "../../model/helpers/hooks";

import NewsList from "../news/NewsList";
import { TaskListItemHome } from "../task-list/TaskListItem";
import { ITaskState } from "../../model/model.typing";
import { regEvent } from "../../utilities/ga-events";
import { HomeTaskListContext, homeTaskListContextDefault } from "../task-list/TaskListContext";

const Home: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const homePage = useStoreState(state => state.components.homePage);
  const { title, content } = useStoreState(state => state.components.homePage);
  const { isLoggedIn } = useStoreState(state => state.session);

  // hide task items overlay using react context
  const [homeTaskListContextValue, setHomeTaskListContextValue] = useState({
    ...homeTaskListContextDefault, 
    setMustHideTaskItemOverlays: setMustHideTaskItemOverlays,
  });

  function setMustHideTaskItemOverlays(taskId, mustRefresh) {
    setHomeTaskListContextValue({
      ...homeTaskListContextValue, 
      mustHideTaskItemOverlays: {
        ...homeTaskListContextValue.mustHideTaskItemOverlays, 
        [taskId]: mustRefresh,
      }
    });
  }

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  return (
    <>
      <section className="home-header">
        <div className="home-section-inner">
          <div className="home-header__cta">
            <h1 dangerouslySetInnerHTML={{ __html: title }} />
            <div className="home-header__cta-text" dangerouslySetInnerHTML={{ __html: content }} />
            <div className="home-header__actions">
              <Link href={isLoggedIn ? "/task-create" : "/login"}>
                <a
                  className="home-header__action-primary"
                  onClick={() => {
                    regEvent("hp_new_task", router);
                  }}
                >
                  Создать задачу
                </a>
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
                {
                  value: homePage.stats?.publish,
                  title: "Задачи ожидают волонтеров",
                  status: "publish",
                },
                {
                  value: homePage.stats?.in_work,
                  title: "Задачи сейчас в работе",
                  status: "in_work",
                },
                { value: homePage.stats?.closed, title: "Решенных задач", status: "closed" },
              ].map((statsItem, index) => {
                return (
                  <Link href={`/tasks/${statsItem.status}/`} key={`home-stats-item-${index}`}>
                    <a className="home-stats__item">
                      <div className="home-stats__item-value">{statsItem.value}</div>
                      <div className="home-stats__item-title">{statsItem.title}</div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="home-tasks home-list-section">
        <div className="home-section-inner">
          <div className="home-list-section__title">Открытые задачи</div>
          <div className="home-list-section__list">
            <HomeTaskListContext.Provider value={homeTaskListContextValue}>
              <div className="task-list">
                {homePage.taskList.map((task, index) => (
                  <Fragment key={`home-taskListItem-${task.id}-${index}`}>
                    <div className={`task-body-wrapper index-${index % 2}`} onClick={() => {
                      console.log("must refresh");
                      setMustHideTaskItemOverlays(task.id, true);
                    }}>
                      <TaskListItemHome {...(task as ITaskState)} />
                    </div>
                  </Fragment>
                ))}
              </div>
            </HomeTaskListContext.Provider>
          </div>
          <div className="home-list-section__footer">
            <Link href={"/tasks"}>
              <a
                className="home-list-section__footer-link"
                onClick={() => {
                  regEvent("hp_more_nav", router);
                }}
              >
                Все задачи
              </a>
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
            <h2>
              Нужна помощь с созданием сайта, продвижением сайта в социальных сетях или созданием
              дизайна?
            </h2>
            <div className="home-footer__cta-action">
              {isLoggedIn && (
                <Link href="/task-create">
                  <a
                    className="home-footer__action-primary"
                    onClick={() => {
                      regEvent("hp_ntask_bottom", router);
                    }}
                  >
                    Создать задачу
                  </a>
                </Link>
              )}
              {!isLoggedIn && (
                <Link href="/registration">
                  <a
                    className="home-footer__action-primary"
                    onClick={() => {
                      regEvent("hp_reg_bottom", router);
                    }}
                  >
                    Зарегистрироваться
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
