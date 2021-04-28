import { ReactElement, MouseEvent, useEffect } from "react";
import { useStoreActions, useStoreState } from "../../model/helpers/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";
import { TaskListItemHome } from "../task-list/TaskListItem";
import MemberListItemTop from "../members/MemberListItemTop";
import withSlideIn from "../hoc/withSlideIn";
import { regEvent } from "../../utilities/ga-events";

const HomeTaskTop: React.FunctionComponent = (): ReactElement => {
  const taskList = useStoreState(state => state.components.homePage.taskList);
  const router = useRouter();

  const handleMoreBtnClick = () => regEvent("hp_more_nav", router);

  return (
    <section className="home-top">
      <h3 className="home-top__title home-title">Открытые задачи</h3>
      <HomeInterfaceSwitch />
      <div className="home-top__list">
        <div className="task-list">
          {taskList.map((task, i) =>
            withSlideIn({
              component: TaskListItemHome,
              from: i % 2 ? "right" : "left",
              fullWidth: false,
              key: task.id,
              ...task,
            })
          )}
        </div>
      </div>
      <div className="home-top__more">
        <Link href="/tasks">
          <a className="btn btn_link" onClick={handleMoreBtnClick}>
            Все задачи
          </a>
        </Link>
      </div>
    </section>
  );
};

const HomeUserTop: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const memberList = useStoreState(state => state.components.homePage.memberList);
  const router = useRouter();

  const handleMoreBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isLoggedIn) {
      router.push("/task-create");
    } else {
      router.push("/registration");
    }
  };

  return (
    <section className="home-top">
      <h3 className="home-top__title home-title">Десятки волонтёров готовы вам помочь</h3>
      <HomeInterfaceSwitch />
      <div className="home-top__list">
        <div className="volunteer-list">
          {memberList?.map((user, i) =>
            withSlideIn({
              component: MemberListItemTop,
              from: i % 2 ? "right" : "left",
              fullWidth: false,
              key: user.id,
              index: i + 1,
              member: user,
            })
          )}
        </div>
      </div>
      <div className="home-top__more">
        <a href="#" className="btn btn_link" onClick={handleMoreBtnClick}>
          Создай задачу
        </a>
      </div>
    </section>
  );
};

const HomeTop: React.FunctionComponent = (): ReactElement => {
  const template = useStoreState(state => state.components.homePage.template);
  const loadMembersRequest = useStoreActions(state => state.components.homePage.loadMembersRequest);

  useEffect(() => loadMembersRequest(), []);

  return template === "author" ? <HomeUserTop /> : <HomeTaskTop />;
};

export default HomeTop;
