import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import { status as statusMap } from "../Task";

const TaskStatus: React.FunctionComponent = (): ReactElement => {
  const isTaskAuthorLoggedIn = useStoreState(state => state.session.isTaskAuthorLoggedIn);
  const { status, slug } = useStoreState(state => state.components.task);
  const statusLabel: boolean | string = status && statusMap.get(status);

  return (
    <div className="task-author-actions">
      {statusLabel && <span className={`status ${status}`}>{statusLabel}</span>}

      {isTaskAuthorLoggedIn && (
        <Link href="/task-actions/[slug]" as={`/task-actions/${slug}`}>
          <a className="edit">Редактировать</a>
        </Link>
      )}
    </div>
  );
};

export default TaskStatus;
