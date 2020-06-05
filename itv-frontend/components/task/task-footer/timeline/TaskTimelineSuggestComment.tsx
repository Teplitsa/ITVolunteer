import { ReactElement, BaseSyntheticEvent, useState } from "react";
import { useStoreActions } from "../../../../model/helpers/hooks";

const TaskTimelineSuggestComment: React.FunctionComponent<{
  suggestedCloseDate: Date | null;
  setOpenDateSuggestComment: (openDateSuggestComment: boolean) => void;
  setOpenDateSuggest: (openDateSuggest: boolean) => void;
}> = ({
  suggestedCloseDate,
  setOpenDateSuggestComment,
  setOpenDateSuggest,
}): ReactElement => {
  const [suggestComment, setSuggestComment] = useState<string>("");
  const suggestCloseDate = useStoreActions(
    (actions) => actions.components.task?.suggestCloseDateRequest
  );
  const typeIn = (
    event: BaseSyntheticEvent<Event, any, HTMLTextAreaElement>
  ) => {
    setSuggestComment(event.target.value.trim());
  };
  const callbackFn = (): void => {
    setOpenDateSuggestComment(false);
    setOpenDateSuggest(false);
  };

  return (
    <div className="timeline-form-wrapper">
      <div className="timeline-form timeline-form-date-comment">
        <h4>Небольшое пояснение</h4>
        <textarea
          id="date_suggest_comment"
          value={suggestComment}
          onChange={typeIn}
          placeholder="Например, задание оказалось сложнее, чем вы думали. Или появились новые обстоятельства."
        ></textarea>
        <div className="comment-action">
          <a
            href="#"
            className="cancel-comment"
            onClick={(event) => {
              event.preventDefault();
              setOpenDateSuggestComment(false);
              setOpenDateSuggest(true);
            }}
          >
            Вернуться
          </a>
          <a
            href="#"
            className="submit-comment"
            onClick={(event) => {
              event.preventDefault();
              suggestCloseDate({
                suggestComment,
                suggestedCloseDate,
                callbackFn,
              });
            }}
          >
            Отправить
          </a>
        </div>
      </div>
    </div>
  );
};

export default TaskTimelineSuggestComment;
