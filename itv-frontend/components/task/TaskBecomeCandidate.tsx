import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const TaskBecomeCandidate: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isTaskAuthorLoggedIn, isUserTaskCandidate } = useStoreState(
    state => state.session
  );
  const { approvedDoer, doers, status } = useStoreState(state => state.components.task);
  const addDoer = useStoreActions(actions => actions.components.task?.addDoerRequest);

  return (
    !isTaskAuthorLoggedIn &&
    !["closed", "archived"].includes(status) && (
      <div className="action-block">

        {!approvedDoer && !isUserTaskCandidate && status === "publish" && (
          <>
            {!(doers && doers.length) &&
              <div className="chance-to-get-task-cta">Воспользуйся возможностью получить задачу</div>
            }

            {isLoggedIn 
              ? <a
                href="#"
                className="btn btn_primary-lg btn_full-width"
                onClick={event => {
                  event.preventDefault();
                  addDoer();
                }}
              >
                Откликнуться на задачу
              </a>
              : <Link href="/login">
                <a className="btn btn_primary-lg btn_full-width">
                  Откликнуться на задачу
                </a>
              </Link>
            }
          </>
        )}

      </div>
    )
  );
};

export default TaskBecomeCandidate;
