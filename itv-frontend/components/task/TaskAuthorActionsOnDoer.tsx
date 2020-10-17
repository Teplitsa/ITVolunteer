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
          className="btn btn_primary"
          onClick={(event) => {
            event.preventDefault();
            approve();
          }}
        >
          Выбрать
        </a>
        <a
          href="#"
          className="btn btn_default"
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
              Посмотрите профиль. Если волонтёр вызывает доверие, нажмите кнопку «Выбрать».
              Вам на почту придут контакты для связи
            </p>
          </div>
          <div className="tooltip-actor">?</div>
        </div>

      </div>
    )
  );
};

export default TaskAuthorActionsOnDoer;
