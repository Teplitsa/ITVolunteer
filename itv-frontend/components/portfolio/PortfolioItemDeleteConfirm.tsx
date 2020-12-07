import { ReactElement } from "react";
// import { useStoreActions, useStoreState } from "../../model/helpers/hooks";
import styles from "../../assets/sass/modules/PortfolioItemDelete.module.scss";

const TaskAdminSupportForm: React.FunctionComponent<{
  closeModal: () => void;
}> = ({ closeModal }): ReactElement => {
  //   const { isLoggedIn, user } = useStoreState(state => state.session);
  //   const adminSupportRequest = useStoreActions(
  //     actions => actions.components.task.adminSupportRequest
  //   );

  const submit = () => null;

  return (
    <>
      <div className={styles["confirm__content"]}>
        После подтверждения, работа будет удалена навсегда
      </div>
      <div className={styles["confirm__action-panel"]}>
        <button
          className={`${styles["confirm__btn"]} ${styles["confirm__btn_cancel"]}`}
          type="button"
          onClick={closeModal}
        >
          Отмена
        </button>
        <button
          className={`${styles["confirm__btn"]} ${styles["confirm__btn_submit"]}`}
          type="button"
          onClick={submit}
        >
          Да, удалить работу
        </button>
      </div>
    </>
  );
};

export default TaskAdminSupportForm;
