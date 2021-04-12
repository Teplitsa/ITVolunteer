import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";

const TaskSuggestionsForVolonteers: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const isTaskAuthorLoggedIn = useStoreState(state => state.session.isTaskAuthorLoggedIn);
  const nextTaskSlug = useStoreState(state => state.components.task.nextTaskSlug);

  if (!isLoggedIn || isTaskAuthorLoggedIn || !nextTaskSlug) return null;

  return (
    <div className="task-get-next">
      <p>Хочешь посмотреть ещё подходящих для тебя задач?</p>
      <Link href="/tasks/[slug]" as={`/tasks/${nextTaskSlug}`}>
        <a>Следующая задача</a>
      </Link>
    </div>
  );
};

export default TaskSuggestionsForVolonteers;