import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";

const TaskAuthorActionsOnDoer: React.FunctionComponent<{
  approve: () => void;
  decline: () => void;
}> = ({ approve, decline }): ReactElement => {
  const { isTaskAuthorLoggedIn, user } = useStoreState((state) => state.session);

  return (
    isTaskAuthorLoggedIn && (
      <div className="author-actions-on-doer">
        <a
          href="#"
          className="accept-doer"
          onClick={(event) => {
            event.preventDefault();
            approve();
          }}
        >
          Выбрать
        </a>
        <a
          href="#"
          className="reject-doer"
          onClick={(event) => {
            event.preventDefault();
            decline();
          }}
        >
          Отклонить
        </a>
        <div className="tooltip">
          <div className="tooltip-buble">
            <h4>Как выбрать волонтёра?</h4>
            <p>
              Посмотрите профиль, если вызывает доверие, нажмите кнопку выбрать.
              На почту придут способы как связаться
            </p>
          </div>
          <div className="tooltip-actor">?</div>
        </div>

      </div>
    )
  );
};

export default TaskAuthorActionsOnDoer;
