import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const TaskBecomeCandidate: React.FunctionComponent = (): ReactElement => {
  const {
    isLoggedIn,
    isTaskAuthorLoggedIn,
    isUserTaskCandidate,
    user,
  } = useStoreState((state) => state.session);
  const { id: taskId, approvedDoer, doers } = useStoreState((state) => state.components.task);
  const addDoer = useStoreActions(
    (actions) => actions.components.task?.addDoerRequest
  );

  const updateDoers = useStoreActions((actions) => actions.components.task?.updateDoers);
  const manageDoer = useStoreActions((actions) => actions.components.task?.manageDoerRequest);
  const {
    taskRequest,
    timelineRequest,
  } = useStoreActions((actions) => actions.components.task);

  const calcelFn = manageDoer.bind(null, {
    action: "remove-candidate",
    taskId,
    doer: user,
    callbackFn: () => {
      updateDoers(doers ? doers.filter(({ id }) => id !== user.id) : []);
      taskRequest();
      timelineRequest();
    }
  });

  return (
    isLoggedIn &&
    !isTaskAuthorLoggedIn && (
      <div className="action-block">
        {!approvedDoer && !isUserTaskCandidate &&
        <a
          href="#"
          className="btn btn_primary-lg btn_full-width"
          onClick={(event) => {
            event.preventDefault();
            addDoer();
          }}
        >
          Откликнуться на задачу
        </a>
        }

        {isUserTaskCandidate && (
          <div className="task-give-response">
            <a
              href="#"
              className="btn btn_secondary btn_full-width"
              onClick={(event) => {
                event.preventDefault();
                calcelFn();
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

export default TaskBecomeCandidate;
