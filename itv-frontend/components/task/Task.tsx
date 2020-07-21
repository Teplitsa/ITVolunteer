import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import TaskHeader from "./task-header/TaskHeader";
import TaskFooter from "./task-footer/TaskFooter";
import TaskStages from "./task-footer/TaskStages";
import TaskTimeline from "../task/task-footer/timeline/TaskTimeline"
import TaskActionBar from "./task-footer/TaskActionBar";
import TaskStatus from "./task-footer/TaskStatus";
import TaskActionButtons from "./task-footer/TaskActionButtons";
import { TaskStatus as TaskStatusType } from "../../model/model.typing";

export const status: Map<TaskStatusType, string> = new Map([
  ["draft", "Черновик"],
  ["publish", "Опубликовано"],
  ["in_work", "В работе"],
  ["closed", "Закрыто"],
]);

const Task: React.FunctionComponent = (): ReactElement => {
  const { content, id: taskId, result, impact, references, files, cover } = useStoreState((state) => state.components.task);

  if(!taskId) {
    return null
  }

  return (
    <div className="task-body">
      <article>
        <TaskHeader />
        <div className="task-body-text">

          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className="task-body-text__section">{result}</div>
          <div className="task-body-text__section">{impact}</div>
          <div className="task-body-text__section">{references}</div>
          <div className="task-body-text__section">{files.map((file) => {
            return (
              <div>
                <a target="_blank" href={file.mediaItemUrl}>{file.mediaItemUrl.replace(/^.*[\\\/]/, '')}</a>
              </div>
            )
          })}</div>

        </div>
        <TaskFooter>
          <TaskStages />
          <TaskTimeline />
          <TaskActionBar>
            <TaskActionButtons />
            <TaskStatus />
          </TaskActionBar>
        </TaskFooter>
      </article>
    </div>
  );
};

export default Task;
