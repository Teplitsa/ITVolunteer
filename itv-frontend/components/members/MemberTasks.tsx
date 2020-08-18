import { ReactElement } from "react";
import TaskCard from "../../components/TaskCard";

const MemberTasks: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="member-tasks">
      <div className="member-tasks__header">
        <div className="member-tasks__title">Задачи</div>
        <div className="member-tasks__filter">
          <ul>
            <li>
              <a
                className="member-tasks__filter-control member-tasks__filter-control_active"
                href="#"
              >
                Открытые (5)
              </a>
            </li>
            <li>
              <a className="member-tasks__filter-control" href="#">
                Черновики (1)
              </a>
            </li>
            <li>
              <a className="member-tasks__filter-control" href="#">
                Закрытые (123)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="member-tasks__list">
        {Array(3)
          .fill(null)
          .map((card, i) => (
            <TaskCard key={i} />
          ))}
      </div>
      <div className="member-tasks__footer">
        <a href="#" className="member-tasks__more-link">
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberTasks;
