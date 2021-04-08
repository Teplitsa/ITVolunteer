import { ReactElement, SyntheticEvent } from "react";
import styles from "../../../assets/sass/modules/ManageTask.module.scss";

const ManageTaskStep2Footer: React.FunctionComponent<{
  goPrevStep: () => void;
}> = ({ goPrevStep }): ReactElement => {
  const goBack = (event: SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    goPrevStep();
  };

  return (
    <a className={styles["manage-task-form__footer-link"]} href="#" onClick={goBack}>
      Предыдущий шаг
    </a>
  );
};

export default ManageTaskStep2Footer;
