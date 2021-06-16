import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import GlobalScripts from "../../../context/global-scripts";
import styles from "../../../assets/sass/modules/ManageTask.module.scss";

const { ModalContext } = GlobalScripts;

const ManageTaskStep: React.FunctionComponent<{
  showInformativeness?: boolean;
}> = ({ children, showInformativeness = true }): ReactElement => {
  const informativenessLevel = useStoreState(
    state => state.components.manageTask.informativenessLevel
  );

  return (
    <ModalContext.Consumer>
      {({ dispatch }) => {
        const openHelpModal = () => {
          dispatch({
            type: "template",
            payload: {
              hAlign: "right",
              title: "Как правильно дать название задачи?",
              // eslint-disable-next-line react/display-name
              header: ({ closeModal }) => {
                return (
                  <div className={styles["manage-task__modal-header"]}>
                    <ul className={styles["manage-task__modal-nav"]}>
                      <li className={styles["manage-task__modal-nav-item"]}>
                        <a href="/sovety-dlya-nko-uspeshnye-zadachi/" target="_blank">
                          Справочный центр
                        </a>
                      </li>
                      <li className={styles["manage-task__modal-nav-item"]}>
                        Советы для организаций
                      </li>
                      <li className={styles["manage-task__modal-nav-item"]}>
                        Составление задачи на ITV
                      </li>
                    </ul>
                    <button
                      type="button"
                      className={styles["manage-task__modal-close"]}
                      onClick={closeModal}
                    />
                  </div>
                );
              },
              // eslint-disable-next-line react/display-name
              content: () => (
                <div className={styles["manage-task__modal-content"]}>
                  <div className={styles["manage-task__modal-title"]}>
                    Как правильно сформулировать задачу?
                  </div>
                  <p>Хорошее название содержит:</p>
                  <ul>
                    <li>суть задачи — сделать сайт, нарисовать логотип, разработать приложение;</li>
                    <li>
                      название технологии, с которой будет работать волонтёр — WordPress, Android,
                      EPS;
                    </li>
                    <li>
                      пояснение, кому это поможет — гражданам, детям, редким животным, врачам.
                    </li>
                  </ul>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Нет</th>
                        <th>Да</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Сделать сайт НКО</td>
                        <td>Сделать сайт на WordPress для поиска пропавших граждан</td>
                      </tr>
                      <tr>
                        <td>Настроить рекламу для дистанционного образования</td>
                        <td>
                          Настроить Yandex Direct и Google Adwords для лендинга курса
                          дополнительного образования
                        </td>
                      </tr>
                      <tr>
                        <td>Настроить рекламу для дистанционного образования</td>
                        <td>
                          Настроить Yandex Direct и Google Adwords для лендинга курса
                          дополнительного образования
                        </td>
                      </tr>
                      <tr>
                        <td>Сделать шаблоны постов</td>
                        <td>Сделать шаблоны постов для экоактивистов в Facebook</td>
                      </tr>
                      <tr>
                        <td>Доработать плагин</td>
                        <td>
                          Доработать плагин Лейка для приёма пожертвований через ApplePay в пользу
                          детей с инвалидностью
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ),
            },
          });
          dispatch({ type: "open" });
        };

        return (
          <div className={styles["manage-task-step"]}>
            <div className={styles["manage-task-step__user-input"]}>{children}</div>
            {showInformativeness && (
              <div className={styles["manage-task-step__informativeness"]}>
                Информативность задачи{" "}
                <span className={styles["manage-task-step__informativeness-label"]}>
                  {informativenessLevel}%
                </span>
                <div className={styles["manage-task-step__informativeness-bar"]}>
                  <div
                    style={{ width: `${informativenessLevel}%` }}
                    className={styles["manage-task-step__informativeness-level"]}
                  />
                </div>
                <a
                  href="#"
                  className={`${styles["manage-task__action-link"]} ${styles["manage-task__action-link_primary"]}`}
                  onClick={event => {
                    event.preventDefault();

                    openHelpModal();
                  }}
                >
                  Как правильно сформулировать задачу?
                </a>
              </div>
            )}
          </div>
        );
      }}
    </ModalContext.Consumer>
  );
};

export default ManageTaskStep;
