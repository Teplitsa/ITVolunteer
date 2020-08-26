import { ReactElement, MouseEvent } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import TaskCard from "../../components/TaskCard";

const MemberTasks: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState((state) => state.session.isAccountOwner);
  const { tasks } = useStoreState((state) => state.components.memberAccount);
  const filters: {
    open: number;
    closed: number;
    draft: number;
    in_work: number;
  } = tasks.list.reduce(
    (previousValue, task) => {
      previousValue[task.status]++;
      return previousValue;
    },
    { open: 0, closed: 0, draft: 0, in_work: 0 }
  );
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
                data-filter={["open", "in_work"]}
                onClick={filter}
              >
                Открытые ({filters.open + filters.in_work})
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
            const cardStatus = card.status === "in_work" ? "open" : card.status;

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
