import React, { ReactElement, useRef, useEffect } from "react";
import styles from "../../../assets/sass/modules/ManageTask.module.scss";

const ManageTaskForm: React.FunctionComponent<{
  title: string;
  subtitle?: string;
  submitTitle: string;
  // eslint-disable-next-line no-unused-vars
  submitHandler: (event: Event) => void;
  submitDisabled?: boolean;
  FormFooter?: ReactElement;
  disabled?: boolean;
}> = ({
  title,
  subtitle,
  submitTitle,
  submitHandler,
  submitDisabled = false,
  FormFooter,
  disabled = false,
  children,
}): ReactElement => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.addEventListener("submit", submitHandler);
  }, []);

  return (
    <form ref={formRef} className={styles["manage-task-form"]}>
      <fieldset disabled={disabled}>
        <div className={styles["manage-task-form__header"]}>
          {subtitle && <div className={styles["manage-task-form__subtitle"]}>{subtitle}</div>}
          <div className={styles["manage-task-form__title"]}>{title}</div>
        </div>
        <div className="manage-task-form__controls">{children}</div>
        <button
          className={`btn btn_primary btn_full-width btn_primary-extra ${
            submitDisabled ? "btn_disabled" : ""
          }`.trim()}
          type="button"
          disabled={submitDisabled}
          onClick={() => formRef.current?.dispatchEvent(new Event("submit"))}
        >
          {submitTitle}
        </button>
        {FormFooter && <div className={styles["manage-task-form__footer"]}>{FormFooter}</div>}
      </fieldset>
    </form>
  );
};

export default ManageTaskForm;
