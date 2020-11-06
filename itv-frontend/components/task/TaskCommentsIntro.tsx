import { ReactElement } from "react";

const TaskCommentsIntro: React.FunctionComponent = ({ children }): ReactElement => {
  return <p className="comments-intro">{children}</p>;
};

export default TaskCommentsIntro;
