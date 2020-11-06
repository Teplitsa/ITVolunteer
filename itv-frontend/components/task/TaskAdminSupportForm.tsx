import { ReactElement, BaseSyntheticEvent, useState } from "react";
import { useStoreActions, useStoreState } from "../../model/helpers/hooks";
import { ISnackbarMessage } from "../../context/global-scripts";
import styles from "../../assets/sass/modules/TaskAdminSupport.module.scss";

const TaskAdminSupportForm: React.FunctionComponent<{
  closeModal: () => void;
  addSnackbar: (message: ISnackbarMessage) => void;
}> = ({ closeModal, addSnackbar }): ReactElement => {
  const { isLoggedIn, user } = useStoreState(state => state.session);
  const [messageText, setMessageText] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const adminSupportRequest = useStoreActions(
    actions => actions.components.task.adminSupportRequest
  );

  const typeIn = (event: BaseSyntheticEvent<Event, any, HTMLTextAreaElement>) => {
    setMessageText(event.target.value);
  };

  const typeInEmail = (event: BaseSyntheticEvent<Event, any, HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const submit = () => {
    let isFormValid = true;
    if (!messageText) {
      isFormValid = false;
      addSnackbar({
        context: "error",
        text: "Пожалуйста, введите текст сообщения.",
      });
    }

    if (!isLoggedIn && !email) {
      isFormValid = false;
      addSnackbar({
        context: "error",
        text: "Пожалуйста, укажите ваш email для обратной связи.",
      });
    }

    if (isFormValid) {
      adminSupportRequest({
        messageText,
        email: isLoggedIn ? user.email : email,
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
        {!isLoggedIn && (
          <input
            className={styles["form__control_text"]}
            placeholder="Ваш email"
            value={email}
            onChange={typeInEmail}
          />
        )}
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
