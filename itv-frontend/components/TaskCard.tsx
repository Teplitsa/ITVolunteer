import { ReactElement } from "react";
import Link from "next/link";
import { IMemberTaskCard } from "../model/model.typing";
import UserCardSmall from "./UserCardSmall";
import TaskTags from "../components/task/task-header/TaskTags";
import { stripTags, getTheIntervalToNow } from "../utilities/utilities";

const TaskCard: React.FunctionComponent<IMemberTaskCard> = (
  task
): ReactElement => {
  const doerCandidatesCountModulo =
    task.doerCandidatesCount < 10
      ? task.doerCandidatesCount
      : Number([...Array.from(String(task.doerCandidatesCount))].pop());

  return (
    <div className="task-card">
      <div className="task-card__header">
        <UserCardSmall {...task.author} />
        <div className="task-card__date">
          {`Открыто ${getTheIntervalToNow({
              fromDateString: task.dateGmt,
          })}`}
        </div>
        <div className="task-card__сandidate-сount">
          {doerCandidatesCountModulo}{" "}
          {doerCandidatesCountModulo === 1
            ? "отклик"
            : [2, 3, 4].includes(doerCandidatesCountModulo)
            ? "отклика"
            : "откликов"}
        </div>
      </div>
      <div className="task-card__title">
        <Link href={`/tasks/${task.slug}`}>
          <a>{task.title}</a>
        </Link>
      </div>
      {task.content && 
      <div className="task-card__excerpt">
        {stripTags(task.content).trim().substr(0, 109)}…{" "}
        <Link href={`/tasks/${task.slug}`}>
          <a>Подробнее</a>
        </Link>
      </div>
      }
      <div className="task-card__footer">
        <TaskTags
          {...{
            tags: task.tags,
            rewardTags: task.rewardTags,
            ngoTaskTags: task.ngoTaskTags,
          }}
        />
      </div>
    </div>
  );
};

export default TaskCard;
