import { ReactElement } from "react";

const TaskActionBar: React.FunctionComponent = ({ children }): ReactElement => {
  return <div className="task-basic-actions-bar">{children}</div>;
};

export default TaskActionBar;
