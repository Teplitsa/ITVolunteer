import { ReactElement } from "react";

const TaskTagGroup: React.FunctionComponent = ({ children }): ReactElement => {
  return <div className="terms">{children}</div>;
};

export default TaskTagGroup;
