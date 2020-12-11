import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import styles from "../../assets/sass/modules/PortfolioItemDelete.module.scss";
import { useRouter } from "next/router";

const PortfolioItemDeleteConfirm: React.FunctionComponent<{
  closeModal: () => void;
}> = ({ closeModal }): ReactElement => {
  const router = useRouter();
  const { author } = useStoreState(
    state => state.components.portfolioItem
  );
  const deletePortfolioItemRequest = useStoreActions(
    actions => actions.components.portfolioItem.deletePortfolioItemRequest
  );

  const deletePortfolioItemHandle = () => {
    router.push(`/members/${author.name}`);
  };

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
          onClick={() =>
            deletePortfolioItemRequest({
              successCallbackFn: deletePortfolioItemHandle,
            })
          }
        >
          Да, удалить работу
        </button>
      </div>
    </>
  );
};

export default PortfolioItemDeleteConfirm;
