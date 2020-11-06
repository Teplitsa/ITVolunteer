import { ReactElement, useState, useEffect, useRef } from "react";
import { IModal } from "../../context/global-scripts";
import styles from "../../assets/sass/modules/Modal.module.scss";

const Modal: React.FunctionComponent<IModal> = ({
  isShown,
  title,
  content: ModalContent,
  dispatch,
}): ReactElement => {
  const [isActive, setActivity] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isShown && setActivity(true);
  }, [isShown]);

  const closeModal = () => {
    setTimeout(() => dispatch({ type: "close" }), 300);
    setActivity(false);
  };

  return (
    isShown && (
      <div
        ref={containerRef}
        className={`${styles.modal} ${isActive ? styles.modal_active : ""}`}
        onClick={event => containerRef.current === event.target && closeModal()}
      >
        <div className={styles.modal__dialog}>
          <div className={styles.modal__content}>
            <div className={styles.modal__header}>
              <h5 className={styles.modal__title}>{title}</h5>
              <button type="button" className={styles.modal__close} onClick={closeModal} />
            </div>
            <div className={styles.modal__body}>
              <ModalContent {...{ closeModal }} />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
