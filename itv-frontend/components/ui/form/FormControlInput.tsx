import { ReactElement, DetailedHTMLProps, InputHTMLAttributes } from "react";
import FormGroup from "./FormGroup";
import withCharCounter from "./hoc/withCharCounter";
import { IFormControlProps } from "../../../model/model.typing";

const NativeInput: React.FunctionComponent<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = props => <input {...props} />;

const NativeInputWithCharCounter: React.FunctionComponent<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = props => withCharCounter({ FormControl: NativeInput, props });

const FormControlInput: React.FunctionComponent<
  IFormControlProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ label, labelExtraClassName, ...nativeProps }): ReactElement => {
  return (
    <FormGroup {...{ label, labelExtraClassName, required: nativeProps.required }}>
      {(nativeProps.maxLength && <NativeInputWithCharCounter {...nativeProps} />) || (
        <NativeInput {...nativeProps} />
      )}
    </FormGroup>
  );
};

export default FormControlInput;
