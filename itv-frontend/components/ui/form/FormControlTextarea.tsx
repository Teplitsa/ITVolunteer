import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from "react";
import FormGroup from "./FormGroup";
import withCharCounter from "./hoc/withCharCounter";
import { IFormControlProps } from "../../../model/model.typing";

const NativeTextArea: React.FunctionComponent<
  DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
> = props => <textarea {...props} />;

const NativeTextAreaWithCharCounter: React.FunctionComponent<
  DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
> = props => withCharCounter({ FormControl: NativeTextArea, props });

const FormControlInput: React.FunctionComponent<
  IFormControlProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
> = ({ label, labelExtraClassName, ...nativeProps }): ReactElement => {
  return (
    <FormGroup {...{ label, labelExtraClassName, required: nativeProps.required }}>
      {(nativeProps.maxLength && <NativeTextAreaWithCharCounter {...nativeProps} />) || (
        <NativeTextArea {...nativeProps} />
      )}
    </FormGroup>
  );
};

export default FormControlInput;
