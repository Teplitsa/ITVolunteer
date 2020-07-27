import { ReactElement, BaseSyntheticEvent, useState, useEffect } from "react";
import { useStoreActions } from "../../model/helpers/hooks";
import { ISnackbarMessage } from "../../context/global-scripts";
import styles from "../../assets/sass/modules/TaskAdminSupport.module.scss";

const TaskAdminSupportForm: React.FunctionComponent<{
  closeModal: () => void;
  addSnackbar: (message: ISnackbarMessage) => void;
}> = ({ closeModal, addSnackbar }): ReactElement => {
  const [messageText, setMessageText] = useState<string>("");
  const adminSupportRequest = useStoreActions(
    (actions) => actions.components.task.adminSupportRequest
  );

  const typeIn = (
    event: BaseSyntheticEvent<Event, any, HTMLTextAreaElement>
  ) => {
    setMessageText(event.target.value);
  };

  const submit = () => {
    if (!messageText) {
      addSnackbar({
        context: "error",
        text: "Пожалуйста, введите текст сообщения.",
      });
    } else {
      adminSupportRequest({
        messageText,
        addSnackbar,
        callbackFn: () => {
          setMessageText("");
          closeModal();
        },
      });
    }
  };

  return (
    <>
      <div className={styles["form__group"]}>
        <textarea
          className={styles["form__control_textarea"]}
          placeholder="Ваше сообщение"
          value={messageText}
          onChange={typeIn}
        ></textarea>
      </div>
      <div className={styles["form__action-panel"]}>
        <button
          className={`${styles["form__btn"]} ${styles["form__btn_cancel"]}`}
          type="button"
          onClick={closeModal}
        >
          Отмена
        </button>
        <button
          className={`${styles["form__btn"]} ${styles["form__btn_submit"]}`}
          type="button"
          onClick={submit}
        >
          Отправить
        </button>
      </div>
    </>
  );
};

export default TaskAdminSupportForm;
