import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import { TaskStatus } from "../../../model/model.typing"

const TaskActionButtons: React.FunctionComponent = (): ReactElement => {
  const isTaskAuthorLoggedIn = useStoreState(
    (state) => state.session.isTaskAuthorLoggedIn
  );
  const { status, id: taskId, isApproved } = useStoreState((state) => state.components.task);
  const taskStatusChange = useStoreActions(
    (actions) => actions.components.task.statusChangeRequest
  );

  const isAdmin = useStoreState((state) => state.session.isAdmin);
  const moderateTaskRequest = useStoreActions((actions) => actions.components.task.moderateRequest);
  const updateTaskStatus = useStoreActions((actions) => actions.components.task.updateStatus);
  const updateModerationStatus = useStoreActions((actions) => actions.components.task.updateModerationStatus);

  const approveTask = moderateTaskRequest.bind(null, {
    action: "approve-task",
    taskId,
    callbackFn: () => {
      updateModerationStatus({isApproved: true})
    },
  });
  const declineTask = moderateTaskRequest.bind(null, {
    action: "decline-task",
    taskId,
    callbackFn: () => {
      updateTaskStatus({status: "draft"})
      updateModerationStatus({isApproved: false})
    }
  });  

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
      {isAdmin && !isApproved && status === "publish" && (
        <div className="task-publication-actions">
          <a
            href="#"
            className="accept-task"
            onClick={(event) => {
              event.preventDefault();
              approveTask();
            }}
          >
            Одобрить задачу
          </a>
          <a
            href="#"
            className="reject-task danger"
            onClick={(event) => {
              event.preventDefault();
              declineTask();
            }}
          >
            Отклонить задачу
          </a>
        </div>
      )}
    </div>
  );
};

export default TaskActionButtons;
