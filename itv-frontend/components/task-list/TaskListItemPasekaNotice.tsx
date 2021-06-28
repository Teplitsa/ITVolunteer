import { ReactElement } from "react";

const TaskListItemPasekaNotice: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="task-paseka-notice">
      <p>
        Заказчик ищет опытного исполнителя или команду, и у задачи есть бюджет. Если вы новичок,
        вступайте в «Пасеку», чтобы объединиться с другими специалистами и вместе решать сложные
        задачи.
      </p>
      <p>
        <a href="https://paseka.te-st.ru/" target="_blank" rel="noreferrer">
          Вступить в Пасеку
        </a>
      </p>
    </div>
  );
};

export default TaskListItemPasekaNotice;
