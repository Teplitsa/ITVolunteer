import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";

const TaskActionButtons: React.FunctionComponent = (): ReactElement => {
  const isTaskAuthorLoggedIn = useStoreState(
    (state) => state.session.isTaskAuthorLoggedIn
  );
  const { status } = useStoreState((state) => state.components.task);
  const taskStatusChange = useStoreActions(
    (actions) => actions.components.task.statusChangeRequest
  );

  return (
    <div>
      {isTaskAuthorLoggedIn && ["draft", "publish"].includes(status) && (
        <div className="task-publication-actions">
          {status === "draft" && (
            <a
              href="#"
              className="accept-task"
              onClick={(event) => {
                event.preventDefault();
                taskStatusChange({ status: "publish" });
              }}
            >
              Опубликовать
            </a>
          )}
          {status === "publish" && (
            <a
              href="#"
              className="reject-task danger"
              onClick={(event) => {
                event.preventDefault();
                taskStatusChange({ status: "draft" });
              }}
            >
              Снять с публикации
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskActionButtons;
