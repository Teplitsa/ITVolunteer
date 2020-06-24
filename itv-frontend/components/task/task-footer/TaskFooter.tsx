import { ReactElement } from "react";

const TaskFooter: React.FunctionComponent = ({ children }): ReactElement => {
  return <footer>{children}</footer>;
};

export default TaskFooter;