import { ReactElement } from "react";

const TaskAdminSupport: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="something-wrong-with-task d-none">
      <a href="#" className="contact-admin">
        Что-то не так с задачей? Напиши администратору
      </a>
    </div>
  );
};

export default TaskAdminSupport;
