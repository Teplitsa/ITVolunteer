/* eslint-disable react/display-name */
import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from "react";
import FormGroup from "./FormGroup";
import withCharCounter from "./hoc/withCharCounter";
import { IFormControlProps } from "../../../model/model.typing";

const FormControlInput: React.FunctionComponent<
  IFormControlProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ label, labelExtraClassName, ...nativeProps }): ReactElement => {
  const Input = nativeProps.maxLength
    ? withCharCounter({ FormControl: () => <input {...nativeProps} /> })
    : () => <input {...nativeProps} />;

  return (
    <FormGroup {...{ label, labelExtraClassName, required: nativeProps.required }}>
      <Input />
    </FormGroup>
  );
};

export default FormControlInput;
