import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const TaskBecomeCandidate: React.FunctionComponent = (): ReactElement => {
  const {
    isLoggedIn,
    isTaskAuthorLoggedIn,
    isUserTaskCandidate,
  } = useStoreState((state) => state.session);
  const { approvedDoer } = useStoreState((state) => state.components.task);
  const addDoer = useStoreActions(
    (actions) => actions.components.task?.addDoerRequest
  );

  return (
    isLoggedIn &&
    !isTaskAuthorLoggedIn &&
    !approvedDoer &&
    !isUserTaskCandidate && (
      <div className="action-block">
        <a
          href="#"
          className="action-button"
          onClick={(event) => {
            event.preventDefault();
            addDoer();
          }}
        >
          Откликнуться на задачу
        </a>
      </div>
    )
  );
};

export default TaskBecomeCandidate;
