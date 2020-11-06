import { ReactElement } from "react";

const TaskHeaderMetaItem: React.FunctionComponent = ({ children }): ReactElement => {
  return <span className="meta-info">{children}</span>;
};

export default TaskHeaderMetaItem;
