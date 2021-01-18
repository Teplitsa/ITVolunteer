import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const TaskCancelCandidate: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isTaskAuthorLoggedIn, isUserTaskCandidate, user } = useStoreState(
    state => state.session
  );
  const { id: taskId, doers, status } = useStoreState(state => state.components.task);

  const updateDoers = useStoreActions(actions => actions.components.task?.updateDoers);
  const manageDoer = useStoreActions(actions => actions.components.task?.manageDoerRequest);
  const { taskRequest, timelineRequest } = useStoreActions(actions => actions.components.task);

  const cancelFn = manageDoer.bind(null, {
    action: "remove-candidate",
    taskId,
    doer: user,
    callbackFn: () => {
      updateDoers(doers ? doers.filter(({ id }) => id !== user.id) : []);
      taskRequest();
      timelineRequest();
    },
  });

  return (
    isLoggedIn &&
    !isTaskAuthorLoggedIn &&
    !["closed", "archived"].includes(status) && (
      <div className="action-block cancel-candidate">
        {isUserTaskCandidate && (
          <div className="task-give-response">
            <a
              href="#"
              className="btn btn_secondary btn_full-width"
              onClick={event => {
                event.preventDefault();
                cancelFn();
              }}
            >
              Отказаться помогать
            </a>
          </div>
        )}
      </div>
    )
  );
};

export default TaskCancelCandidate;
