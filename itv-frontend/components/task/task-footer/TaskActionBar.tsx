import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import { status as taskStatus } from "../Task";

const TaskActionBar: React.FunctionComponent = ({ children }): ReactElement => {
  return <div className="task-basic-actions-bar">{children}</div>;
};

export default TaskActionBar;
