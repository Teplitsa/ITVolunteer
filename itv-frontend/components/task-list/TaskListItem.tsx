import { ReactElement } from "react";
import { ITaskState } from "../../model/model.typing";
import Link from "next/link";
import * as utils from "../../utilities/utilities";
import { UserSmallView } from "../UserView";
import TaskMeta from "../task/task-header/TaskMeta";
import TaskMetaItem from "../task/task-header/TaskMetaItem";
import TaskTags from "../task/task-header/TaskTags";

const TaskListItem: React.FunctionComponent<ITaskState> = (
  task
): ReactElement => {
  return (
    <div className="task-body">
      <div className="task-author-meta">
        <UserSmallView user={task.author} />
        {task.author?.organizationName && (
          <UserSmallView
            user={{
              itvAvatar: task.author.organizationLogo,
              fullName: task.author.organizationName,
              memberRole: "Организация",
            }}
          />
        )}
      </div>
      <h1>
        <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
          <a dangerouslySetInnerHTML={{ __html: task.title }} />
        </Link>
      </h1>
      <TaskMeta {...task} />
      {!!task && !!task.coverImgSrcLong &&
        <div className="task-cover">
          <img src={task.coverImgSrcLong} />
        </div>
      }
      {task.content && (
        <div
          className="task-content"
          dangerouslySetInnerHTML={{ __html: task.content }}
        />
      )}
      <TaskTags {...task} />
    </div>
  );
};

export const TaskListItemHome: React.FunctionComponent<ITaskState> = ({
  task,
}): ReactElement => {
  return (
    <div className={`task-body`}>
      <div className="task-author-meta">
        {!task.author?.organizationName && 
          <UserSmallView user={task.author} />
        }
        {task.author?.organizationName && (
          <UserSmallView
            user={{
              itvAvatar: task.author.organizationLogo,
              fullName: task.author.organizationName,
              memberRole: "Организация",
            }}
          />
        )}
        <TaskMetaItem>
          <span>{`Открыто ${utils.getTheIntervalToNow({
              fromDateString: task.dateGmt,
            })}`}
          </span>
        </TaskMetaItem>        
      </div>
      <h3 className="task-title">
        <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
          <a dangerouslySetInnerHTML={{ __html: task.title }} />
        </Link>
      </h3>
      <TaskTags {...task} />
    </div>
  );
};

export default TaskListItem;
