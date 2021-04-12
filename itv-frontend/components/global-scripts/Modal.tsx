import { ReactElement, useState, useEffect, useRef } from "react";
import { IModal } from "../../context/global-scripts";
import styles from "../../assets/sass/modules/Modal.module.scss";

const Modal: React.FunctionComponent<IModal> = ({
  isShown,
  hAlign = "center",
  hideBackdrop,
  title,
  header: ModalHeader,
  content: ModalContent,
  dispatch,
}): ReactElement => {
  const [isActive, setActivity] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTimerRef = useRef<NodeJS.Timeout>(null);
  const closeTimerRef = useRef<NodeJS.Timeout>(null);

  useEffect(
    () => () => {
      clearTimeout(activeTimerRef.current);
      clearTimeout(closeTimerRef.current);
    },
    []
  );

  useEffect(() => {
    isShown && setActivity(true);
  }, [isShown]);

  useEffect(() => {
    activeTimerRef.current = setTimeout(
      () => containerRef.current?.classList[isActive ? "add" : "remove"](styles.modal_active),
      0
    );
  }, [isActive]);

  const closeModal = () => {
    closeTimerRef.current = setTimeout(() => dispatch({ type: "close" }), 300);
    setActivity(false);
  };

  return (
    isShown && (
      <div
        ref={containerRef}
        className={`${styles.modal} ${hideBackdrop ? "" : styles.modal_backdrop} ${
          styles[`modal_halign-${hAlign}`]
        }`.trim()}
        onClick={event => containerRef.current === event.target && closeModal()}
      >
        <div
          className={`${styles.modal__dialog} ${
            styles[`modal__dialog_${hAlign === "center" ? "all" : `no-${hAlign}-side`}-rounded`]
          }`.trim()}
        >
          <div className={styles.modal__content}>
            {(ModalHeader && <ModalHeader {...{ closeModal }} />) || (
              <div className={styles.modal__header}>
                {title && <h5 className={styles.modal__title}>{title}</h5>}
                <button type="button" className={styles.modal__close} onClick={closeModal} />
              </div>
            )}
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
