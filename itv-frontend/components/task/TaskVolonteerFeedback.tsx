import { ReactElement, useEffect } from "react";
import TaskDoer from "./TaskDoer";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const TaskVolonteerFeedback: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isTaskAuthorLoggedIn } = useStoreState(state => state.session);
  const { approvedDoer, doers } = useStoreState(state => state.components.task);
  const doersRequest = useStoreActions(actions => actions.components.task.doersRequest);

  useEffect(() => {
    isLoggedIn && doersRequest();
  }, [isLoggedIn, doersRequest]);

  return (
    isLoggedIn &&
    !approvedDoer &&
    doers &&
    doers.length > 0 && (
      <>
        <h2>Отклики на задачу</h2>
        <div className="sidebar-users-block responses">
          {isTaskAuthorLoggedIn && (
            <div className="choose-doer-explanation">
              У вас есть 3 дня на одобрение/отклонение кандидата. После прохождения 3-х дней мы
              снимаем баллы.
            </div>
          )}
          <div className="user-cards-list">
            {doers.map(doer => (
              <TaskDoer key={doer.id} {...doer} />
            ))}
          </div>
        </div>
      </>
    )
  );
};

export default TaskVolonteerFeedback;
