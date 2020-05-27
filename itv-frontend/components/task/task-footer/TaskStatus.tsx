import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import { status as statusMap } from "../Task";

const TaskStatus: React.FunctionComponent = (): ReactElement => {
  const isTaskAuthorLoggedIn = useStoreState(
    (state) => state.session.isTaskAuthorLoggedIn
  );
  const { status, databaseId: taskDataBaseId } = useStoreState(
    (state) => state.components.task
  );
  const statusLabel: boolean | string = status && statusMap.get(status);

  return (
    <div className="task-author-actions">
      {statusLabel && <span className={`status ${status}`}>{statusLabel}</span>}

      {isTaskAuthorLoggedIn && (
        <a
          href={`/task-actions/?task=${taskDataBaseId}`}
          className="edit"
          target="_blank"
        >
          Редактировать
        </a>
      )}
    </div>
  );
};

export default TaskStatus;
