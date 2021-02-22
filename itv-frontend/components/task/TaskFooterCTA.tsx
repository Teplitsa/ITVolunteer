import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const TaskFooterCTA: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const isTaskAuthorLoggedIn = useStoreState(state => state.session.isTaskAuthorLoggedIn);
  const isUserTaskCandidate = useStoreState(state => state.session.isUserTaskCandidate);
  const approvedDoer = useStoreState(state => state.components.task.approvedDoer);
  const addDoer = useStoreActions(actions => actions.components.task.addDoerRequest);

  if (!isLoggedIn || isTaskAuthorLoggedIn || approvedDoer || isUserTaskCandidate) return null;

  return (
    <div className="task-give-response">
      <p>
        Кликнув на кнопку, вы попадете в список волонтёров откликнувшихся на задачу. Заказчик задачи
        выберет подходящего из списка.
      </p>
      <a
        href="#"
        className="button-give-response"
        onClick={event => {
          event.preventDefault();
          addDoer();
        }}
      >
        Откликнуться на задачу
      </a>
    </div>
  );
};

export default TaskFooterCTA;
