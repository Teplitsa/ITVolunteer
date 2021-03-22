import {
  ReactElement,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ChangeEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import { IFormInputDateProps } from "../../../model/model.typing";
import { convertDateToLocalISOString } from "../../../utilities/utilities";

registerLocale("ru-RU", ru);

const FormControlInputDate: React.FunctionComponent<
  IFormInputDateProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ label, labelExtraClassName, inputDatePlaceholder, ...nativeProps }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(
    nativeProps.defaultValue ? new Date(nativeProps.defaultValue as string) : null
  );
  const [datePickerShown, setDatePickerShown] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current.addEventListener("change", (event: Event) => {
      setSelectedDate(new Date((event.currentTarget as HTMLInputElement).value));
    });
  }, []);

  return (
    <div className="form__group">
      {label && (
        <label className={`form__label ${labelExtraClassName ?? ""}`.trim()}>
          {label} {nativeProps.required && <span className="form__required">*</span>}
        </label>
      )}
      <div className="form__date-control-wrapper">
        <input ref={inputRef} style={{ display: "none" }} {...nativeProps} type="date" />
        <div
          className="form__control_input form__control_input-small form__control_full-width"
          onClick={() => setDatePickerShown(!datePickerShown)}
        >
          <span className="form__date-placeholder">
            {selectedDate instanceof Date
              ? selectedDate.toLocaleDateString()
              : inputDatePlaceholder ?? ""}
          </span>
        </div>
        {datePickerShown && (
          <div className="form__date-picker">
            <DatePicker
              selected={selectedDate}
              dateFormat="YYYY-MM-DD"
              locale="ru-RU"
              inline
              minDate={(nativeProps.min && new Date(nativeProps.min)) || null}
              onChange={date => {
                inputRef.current.value = convertDateToLocalISOString({ date });
                nativeProps.onChange({
                  target: inputRef.current,
                  currentTarget: inputRef.current,
                } as ChangeEvent<HTMLInputElement>);
                inputRef.current.dispatchEvent(new Event("change"));
                setDatePickerShown(!datePickerShown);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormControlInputDate;
