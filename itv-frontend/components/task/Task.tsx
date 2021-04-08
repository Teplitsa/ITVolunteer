import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import TaskHeader from "./task-header/TaskHeader";
import TaskFooter from "./task-footer/TaskFooter";
import TaskStages from "./task-footer/TaskStages";
import TaskTimeline from "../task/task-footer/timeline/TaskTimeline";
import TaskActionBar from "./task-footer/TaskActionBar";
import TaskStatus from "./task-footer/TaskStatus";
import TaskActionButtons from "./task-footer/TaskActionButtons";
import { TaskStatus as TaskStatusType } from "../../model/model.typing";
import { convertUrlToAnchor } from "../../utilities/utilities";

import taskInWorkLabel from "../../assets/img/task-in-work-label.svg";

export const status: Map<TaskStatusType, string> = new Map([
  ["draft", "Черновик"],
  ["publish", "Опубликовано"],
  ["in_work", "В работе"],
  ["closed", "Закрыто"],
  ["archived", "В архиве"],
]);

const Task: React.FunctionComponent = (): ReactElement => {
  const {
    content,
    id: taskId,
    resultHtml,
    impactHtml,
    referencesHtml,
    externalFileLinksList,
    files,
    status,
  } = useStoreState(state => state.components.task);

  if (!taskId) {
    return null;
  }

  return (
    <div className="task-body">
      {status === "in_work" && (
        <img src={taskInWorkLabel} className="task-in-work-label" alt="Задача в работе" />
      )}
      <article>
        <TaskHeader />
        <div className="task-body-text">
          {!!content && String(content).trim().length > 0 && (
            <div className="task-body-text__section">
              <h3>Суть задачи</h3>
              <div
                className="task-body-text__section-content"
                dangerouslySetInnerHTML={{ __html: convertUrlToAnchor({ html: content }) }}
              />
            </div>
          )}

          {!!resultHtml && String(resultHtml).trim().length > 0 && (
            <div className="task-body-text__section">
              <h3>Какой результат ожидаем</h3>
              <div className="task-body-text__section-content">{resultHtml}</div>
            </div>
          )}

          {!!impactHtml && String(impactHtml).trim().length > 0 && (
            <div className="task-body-text__section">
              <h3>Какую пользу принесет решение задачи</h3>
              <div className="task-body-text__section-content">{impactHtml}</div>
            </div>
          )}

          {!!referencesHtml && String(referencesHtml).trim().length > 0 && (
            <div className="task-body-text__section">
              <h3>Хорошие примеры реализации</h3>
              <div
                className="task-body-text__section-content"
                dangerouslySetInnerHTML={{ __html: referencesHtml }}
              />
            </div>
          )}

          {(files.length > 0 || externalFileLinksList.length > 0) && (
            <div className="task-body-text__section">
              <h3>Файлы</h3>
              <div className="task-body-text__section-content">
                <div className="task-body-text__section-files">
                  {externalFileLinksList.map((url, key) => {
                    return (
                      <div className="task-body-text__section-file-item" key={key}>
                        <a target="_blank" rel="noreferrer" href={url}>
                          {url.replace(/^.*\//, "")}
                        </a>
                      </div>
                    );
                  })}
                  {files.map((file, key) => {
                    return (
                      <div className="task-body-text__section-file-item" key={key}>
                        <a target="_blank" rel="noreferrer" href={file.mediaItemUrl}>
                          {file.mediaItemUrl.replace(/^.*\//, "")}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
