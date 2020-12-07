import { ReactElement } from "react";
// import { useStoreState } from "../../model/helpers/hooks";
// import Link from "next/link";
// import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberNotifications: React.FunctionComponent = (): ReactElement => {
  //   const isAccountOwner = useStoreState(state => state.session.isAccountOwner);
  //   const { tasks, memberTaskStats } = useStoreState(state => state.components.memberAccount);

  //   const { setTaskListFilter, getMemberTasksRequest } = useStoreActions(
  //     actions => actions.components.memberAccount
  //   );

  // const { username } = useStoreState(store => store.components.memberAccount);

  return (
    <div className="member-notifications">
      <div className="member-notifications__header">
        <div className="member-notifications__title">Оповещения</div>
        <div className="member-tasks__filter">
          <ul>
            <li>
              <a
                className="member-tasks__filter-control member-tasks__filter-control_active"
                href="#"
              >
                Все (126)
              </a>
            </li>
            <li>
              <a className="member-tasks__filter-control" href="#">
                По проектам (3)
              </a>
            </li>
            <li>
              <a className="member-tasks__filter-control" href="#">
                Информационные (123)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="member-notifications__list">
        <div className="member-notifications__list-item member-notifications__list-item_warning-message">
          <div className="member-notifications__list-item-title">
            У вас осталось 2 дня чтобы закрыть задачу{" "}
            <span className="member-notifications__keyword">Нужен сайт на Word Press</span>
          </div>
          <div className="member-notifications__list-item-time">2 ч. назад</div>
        </div>
        <div className="member-notifications__list-item">
          <div className="member-notifications__list-item-title">
            <span className="member-notifications__keyword">Александр Гусев</span> прокомментировал
            задачу <span className="member-notifications__keyword">Нужен сайт на Word Press</span>
          </div>
          <div className="member-notifications__list-item-time">3 ч. назад</div>
        </div>
        <div className="member-notifications__list-item">
          <div className="member-notifications__list-item-title">
            Приходите на конференцию 11 апреля, будет круто
          </div>
          <div className="member-notifications__list-item-time">3 ч. назад</div>
        </div>
        <div className="member-notifications__list-item member-notifications__list-item_new-message">
          <div className="member-notifications__list-item-title">
            <span className="member-notifications__keyword">Новая задача</span> по тегу{" "}
            <span className="member-notifications__keyword">WordPress</span> посмотрим?{" "}
            <a href="#">Перейти к задаче</a>
          </div>
          <div className="member-notifications__list-item-time">3 ч. назад</div>
        </div>
        <div className="member-notifications__list-item">
          <div className="member-notifications__list-item-title">
            Вы получили награду за{" "}
            <span className="member-notifications__keyword">10 закрытых задач</span>
          </div>
          <div className="member-notifications__list-item-time">3 ч. назад</div>
        </div>
      </div>
      <div className="member-notifications__footer">
        <a
          href="#"
          className="member-notifications__more-link"
          onClick={event => {
            event.preventDefault();
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberNotifications;
