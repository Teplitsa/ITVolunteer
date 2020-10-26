import { ReactElement, MouseEvent, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import TaskCard from "../../components/TaskCard";

const MemberTasks: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState((state) => state.session.isAccountOwner);
  const { tasks, memberTaskStats } = useStoreState((state) => state.components.memberAccount);
  
  const filters: {
    open: number;
    closed: number;
    draft: number;
    in_work: number;
    publish: number;
  } = {...memberTaskStats, open: 0};

  const { setTaskListFilter, getMemberTasksRequest } = useStoreActions(
    (actions) => actions.components.memberAccount
  );

  const filter = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const currentFilter = event.currentTarget.dataset.filter;

    if (currentFilter.includes("open") || currentFilter.includes("in_work")) {
      setTaskListFilter("open");
    } else if (currentFilter.includes("closed")) {
      setTaskListFilter("closed");
    } else if (currentFilter.includes("draft")) {
      setTaskListFilter("draft");
    }
  };

  return (
    <div className="member-tasks">
      <div className="member-tasks__header">
        <div className="member-tasks__title">Задачи</div>
        <div className="member-tasks__filter">
          <ul>
            <li>
              <a
                className={`member-tasks__filter-control ${
                  tasks.filter === "open"
                    ? "member-tasks__filter-control_active"
                    : ""
                }`}
                href="#"
                data-filter={["open", "in_work", "publish"]}
                onClick={filter}
              >
                Открытые ({filters.open + filters.in_work + filters.publish})
              </a>
            </li>
            {isAccountOwner && (
              <li>
                <a
                  className={`member-tasks__filter-control ${
                    tasks.filter === "draft"
                      ? "member-tasks__filter-control_active"
                      : ""
                  }`}
                  href="#"
                  data-filter={["draft"]}
                  onClick={filter}
                >
                  Черновики ({filters.draft})
                </a>
              </li>
            )}
            <li>
              <a
                className={`member-tasks__filter-control ${
                  tasks.filter === "closed"
                    ? "member-tasks__filter-control_active"
                    : ""
                }`}
                href="#"
                data-filter={["closed"]}
                onClick={filter}
              >
                Закрытые ({filters.closed})
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="member-tasks__list">
        {tasks.list
          .filter((card) => {
            const cardStatus = (card.status === "in_work" || card.status === "publish") ? "open" : card.status;

            // console.log("card:", card)
            // console.log("cardStatus:", cardStatus)
            // console.log("tasks.filter:", tasks.filter)

            return cardStatus === tasks.filter;
          })
          .map((card) => (
            <TaskCard key={card.id} {...card} />
          ))}
      </div>
      <div className="member-tasks__footer">
        <a
          href="#"
          className="member-tasks__more-link"
          onClick={(event) => {
            event.preventDefault();
            getMemberTasksRequest();
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberTasks;
