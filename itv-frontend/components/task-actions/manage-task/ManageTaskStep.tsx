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
                return <div className={styles["manage-task__modal-header"]}>
                  <ul className={styles["manage-task__modal-nav"]}>
                    <li className={styles["manage-task__modal-nav-item"]}>
                      <a href="/sovety-dlya-nko-uspeshnye-zadachi/" target="_blank">Справочный центр</a>
                    </li>
                    <li className={styles["manage-task__modal-nav-item"]}>Советы для организаций</li>
                    <li className={styles["manage-task__modal-nav-item"]}>Как правильно дать название задачи?</li>
                  </ul>
                  <button type="button" className={styles["manage-task__modal-close"]} onClick={closeModal} />
                </div>;
              },
              // eslint-disable-next-line react/display-name
              content: () => (
                <div className={styles["manage-task__modal-content"]}>
                  <div className={styles["manage-task__modal-title"]}>
                    Как правильно дать название задачи?
                  </div>
                  <p>
                    Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её
                    специфики.
                  </p>
                  <p>Например: «сделать сайт благотворительной организации» — плохой заголовок.</p>
                  <p>«Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
                  <p>В хорошем заголовке должны быть указана желаемая технология, например:</p>
                  <ul>
                    <li>сайт на WP</li>
                    <li>приложение под андроид</li>
                    <li>макет в EPS</li>
                    <li>и так далее.</li>
                  </ul>
                  <p>Указание на то, для чего это всё (кратко, в два-три слова):</p>
                  <ul>
                    <li>поиск граждан,</li>
                    <li>помощь детям,</li>
                    <li>помощь домашним животным,</li>
                    <li>помощь врачам.</li>
                  </ul>
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
                  Как правильно назвать задачу?
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
