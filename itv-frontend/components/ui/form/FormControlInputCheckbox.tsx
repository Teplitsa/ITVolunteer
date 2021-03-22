import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { IFormInputCheckboxProps } from "../../../model/model.typing";

const FormControlInputCheckbox: React.FunctionComponent<
  IFormInputCheckboxProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ label, Explanation, ...nativeCheckboxProps }): ReactElement => {
  return (
    <div className="form__checkbox-group">
      <input
        style={{ display: "none" }}
        id={nativeCheckboxProps.id ?? nativeCheckboxProps.name}
        {...nativeCheckboxProps}
        type="checkbox"
      />
      {label && (
        <label
          htmlFor={nativeCheckboxProps.id ?? nativeCheckboxProps.name}
          className="form__checkbox-label"
        >
          <span className="form__checkbox-label-text">{label}</span>
        </label>
      )}
      <div className="form__checkbox-explanation">{Explanation && <Explanation />}</div>
    </div>
  );
};

export default FormControlInputCheckbox;
