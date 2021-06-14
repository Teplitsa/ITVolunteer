import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { IFormInputRadioProps } from "../../../model/model.typing";

const FormControlInputRadio: React.FunctionComponent<
  IFormInputRadioProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ children, label, ...nativeCheckboxProps }): ReactElement => {
  return (
    <div className="form__radio">
      <input
        style={{ display: "none" }}
        id={nativeCheckboxProps.id ?? nativeCheckboxProps.name}
        {...nativeCheckboxProps}
        type="radio"
      />
      {label && (
        <label
          htmlFor={nativeCheckboxProps.id ?? nativeCheckboxProps.name}
          className="form__radio-label"
        >
          {label}
        </label>
      )}
      {children ?? ""}
    </div>
  );
};

export default FormControlInputRadio;
