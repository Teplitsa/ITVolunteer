import { ReactElement, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

registerLocale("ru-RU", ru);

const TaskTimelineDateSuggest: React.FunctionComponent<{
  setOpenDateSuggest: (isOpenDateSuggest: boolean) => void;
  setOpenDateSuggestComment: (isOpenDateSuggestComment: boolean) => void;
  setSuggestedCloseDate: (date: Date) => void;
}> = ({
  setOpenDateSuggest,
  setOpenDateSuggestComment,
  setSuggestedCloseDate,
}): ReactElement => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="timeline-form-wrapper">
      <div className="timeline-form timeline-form-date-suggest">
        <DatePicker
          selected={selectedDate}
          dateFormat="dd.MM.yyyy"
          locale="ru-RU"
          inline
          onChange={(date) => setSelectedDate(date)}
        />
        <div className="comment-action">
          <a
            href="#"
            className="cancel-comment"
            onClick={(event) => {
              event.preventDefault();
              setOpenDateSuggest(false);
            }}
          >
            Отмена
          </a>
          <a
            href="#"
            className="submit-comment"
            onClick={(event) => {
              event.preventDefault();
              setSuggestedCloseDate(selectedDate);
              setOpenDateSuggest(false);
              setOpenDateSuggestComment(true);
            }}
          >
            Подтвердить дату
          </a>
        </div>
      </div>
    </div>
  );
};

export default TaskTimelineDateSuggest;
