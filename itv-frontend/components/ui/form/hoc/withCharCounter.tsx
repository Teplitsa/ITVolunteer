import { ReactElement, useRef, useEffect, useState } from "react";

const withCharCounter = ({
  FormControl,
}: {
  FormControl: React.FunctionComponent;
}): React.FunctionComponent => {
  const FormControlWithCharCounter = (): ReactElement => {
    const [charCounterValue, setCharCounterValue] = useState<number>(0);
    const [maxCharCount, setMaxCharCount] = useState<number>(0);
    const formControlRef = useRef<HTMLDivElement>(null);

    const inputHandler = (event: Event) =>
      setCharCounterValue(
        (event.currentTarget as HTMLInputElement | HTMLTextAreaElement).value.length
      );

    useEffect(() => {
      const control = formControlRef.current.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        "[class*=form__control]"
      );

      setCharCounterValue(control.value.length);
      setMaxCharCount(control.maxLength);

      control.addEventListener("input", inputHandler);

      return () => control.removeEventListener("input", inputHandler);
    }, []);

    return (
      <div className="form__char-counter" ref={formControlRef}>
        <FormControl />
        <div className="form__char-counter-value">
          {charCounterValue}/{maxCharCount}
        </div>
      </div>
    );
  };

  return FormControlWithCharCounter;
};

export default withCharCounter;
