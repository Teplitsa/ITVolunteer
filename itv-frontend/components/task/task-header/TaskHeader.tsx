import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import TaskMeta from "./TaskMeta";
import TaskTags from "./TaskTags";

const TaskHeader: React.FunctionComponent = (): ReactElement => {
  const { title } = useStoreState((state) => state.components.task);
  const task = useStoreState((state) => state.components.task);

  return (
    <header>
      <h1 dangerouslySetInnerHTML={{ __html: title }} />
      <TaskMeta task={task} />
      <TaskTags task={task} />
    </header>
  );
};

export default TaskHeader;
