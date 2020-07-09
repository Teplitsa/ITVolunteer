import { ReactElement, Dispatch, useState, useEffect } from "react";
import { ISnackbar, ISnackbarMessage } from "../../context/global-scripts";
import styles from "../../assets/sass/modules/Snackbar.module.scss";

const SnackbarListItem: React.FunctionComponent<{
  message: ISnackbarMessage;
  dispatch: Dispatch<{
    type: string;
    payload?: ISnackbar;
  }>;
}> = ({ message, dispatch }): ReactElement => {
  const [isActive, setActivity] = useState<boolean>(false);

  const closeSnackbar = () => {
    setTimeout(
      () => dispatch({ type: "delete", payload: { messages: [message] } }),
      300
    );
    setActivity(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => closeSnackbar(), 10000);
    setActivity(true);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <div
      className={`${styles["snackbar-list__item"]} ${
        styles[`snackbar-list__item_${message.context}`]
      } ${isActive ? styles["snackbar-list__item_active"] : ""}`}
    >
      <span className={styles["snackbar-list__item-text"]}>{message.text}</span>
      <button
        onClick={closeSnackbar}
        className={styles["snackbar-list__item-close"]}
        type="button"
      />
    </div>
  );
};

export default SnackbarListItem;
