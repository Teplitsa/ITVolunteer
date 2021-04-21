import { ReactElement } from "react";
import { ITaskState } from "../../model/model.typing";
import Link from "next/link";
import { useRouter } from "next/router";

import { regEvent } from "../../utilities/ga-events";

import { UserSmallView } from "../UserView";
import TaskMeta from "../task/task-header/TaskMeta";
import TaskTags from "../task/task-header/TaskTags";

const TaskListItem: React.FunctionComponent<ITaskState> = (task): ReactElement => {
  const router = useRouter();

  return (
    <div className="task-body">
      <div className="task-author-meta">
        <UserSmallView user={task.author} />
        {task.author?.organizationName && (
          <UserSmallView
            user={{
              itvAvatar: task.author.organizationLogo,
              fullName: task.author.organizationName,
              slug: task.author.slug,
              memberRole: "Организация",
            }}
          />
        )}
        <div className="task-author-meta-tail-shadow"></div>
      </div>
      <h1 className="task-body__title">
        <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
          <a
            dangerouslySetInnerHTML={{ __html: task.title }}
            onClick={() => {
              regEvent("tc_title", router);
            }}
          />
        </Link>
      </h1>
      <TaskMeta {...task} />
      {task.coverImgSrcLong && (
        <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
          <a className="task-cover">
            <img src={task.coverImgSrcLong} />
          </a>
        </Link>
      )}
      {task.content && (
        <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
          <a className="clickable-task-content">
            <div className="task-content" dangerouslySetInnerHTML={{ __html: task.content }} />
          </a>
        </Link>        
      )}
      <TaskTags {...task} />
    </div>
  );
};

export const TaskListItemHome: React.FunctionComponent<ITaskState> = (task): ReactElement => {
  const router = useRouter();

  return (
    <div className="task-body">
      <div className="task-author-meta">
        <UserSmallView user={task.author} />
        {task.author?.organizationName && (
          <UserSmallView
            user={{
              itvAvatar: task.author.organizationLogo,
              fullName: task.author.organizationName,
              slug: task.author.slug,
              memberRole: "Организация",
            }}
          />
        )}
        <div className="task-author-meta-tail-shadow"></div>
      </div>
      <h3 className="task-body__title">
        <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
          <a
            dangerouslySetInnerHTML={{ __html: task.title }}
            onClick={() => {
              regEvent("tc_title", router);
            }}
          />
        </Link>
      </h3>
      <TaskMeta {...task} />
      {task.coverImgSrcLong && (
        <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
          <a className="task-cover">
            <img src={task.coverImgSrcLong} />
          </a>
        </Link>
      )}
      <TaskTags {...task} />
    </div>
  );
};

export default TaskListItem;
