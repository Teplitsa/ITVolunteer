import { ReactElement } from "react";
import { IFormControlProps } from "../../../model/model.typing";

const FormGroup: React.FunctionComponent<IFormControlProps> = ({
  label,
  labelExtraClassName,
  required,
  children,
}): ReactElement => {
  return (
    <div className="form__group">
      {label && (
        <label className={`form__label ${labelExtraClassName ?? ""}`.trim()}>
          {label} {required && <span className="form__required">*</span>}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormGroup;
