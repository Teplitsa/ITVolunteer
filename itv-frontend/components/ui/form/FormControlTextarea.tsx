/* eslint-disable react/display-name */
import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from "react";
import FormGroup from "./FormGroup";
import withCharCounter from "./hoc/withCharCounter";
import { IFormControlProps } from "../../../model/model.typing";

const FormControlInput: React.FunctionComponent<
  IFormControlProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
> = ({ label, labelExtraClassName, ...nativeProps }): ReactElement => {
  const TextArea = nativeProps.maxLength
    ? withCharCounter({ FormControl: () => <textarea {...nativeProps} /> })
    : () => <textarea {...nativeProps} />;

  return (
    <FormGroup {...{ label, labelExtraClassName, required: nativeProps.required }}>
      <TextArea />
    </FormGroup>
  );
};

export default FormControlInput;
