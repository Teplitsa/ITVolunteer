import { ReactElement } from "react";
import { generateUniqueKey } from "../../utilities/utilities";
import { ISnackbar } from "../../context/global-scripts";
import SnackbarListItem from "./SnackbarListItem";
import styles from "../../assets/sass/modules/Snackbar.module.scss";

const SnackbarList: React.FunctionComponent<ISnackbar> = ({
  messages,
  dispatch,
}): ReactElement => {
  return (
    messages?.length > 0 && (
      <div className={`${styles["snackbar-list"]}`}>
        {messages.map((message, i) => {
          return (
            <SnackbarListItem
              key={generateUniqueKey({
                base: message.text,
                prefix: "Snackbar",
              })}
              {...{ message, dispatch }}
            />
          );
        })}
      </div>
    )
  );
};

export default SnackbarList;
