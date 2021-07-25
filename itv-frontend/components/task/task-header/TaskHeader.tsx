import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import TaskMeta from "./TaskMeta";
import TaskTags from "./TaskTags";
import TaskListItemPasekaNotice from "../../task-list/TaskListItemPasekaNotice";

const TaskHeader: React.FunctionComponent = (): ReactElement => {
  const { title, coverImgSrcLong } = useStoreState(state => state.components.task);
  const task = useStoreState(state => state.components.task);

  return (
    <header>
      <h1 dangerouslySetInnerHTML={{ __html: title }} />
      <TaskMeta {...task} />
      {!!coverImgSrcLong && (
        <div className="task-cover">
          <img src={coverImgSrcLong} />
        </div>
      )}      
      <TaskTags {...task} />
      {task.isPasekaChecked && <TaskListItemPasekaNotice />}
    </header>
  );
};

export default TaskHeader;
