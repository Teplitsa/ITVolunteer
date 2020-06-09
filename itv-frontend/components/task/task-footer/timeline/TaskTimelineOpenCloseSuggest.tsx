import { ReactElement, BaseSyntheticEvent, useState } from "react";
import { useStoreState, useStoreActions } from "../../../../model/helpers/hooks";

const TaskTimelineOpenCloseSuggest: React.FunctionComponent<{
  setOpenCloseSuggest: (isOpenCloseSuggest: boolean) => void;
}> = ({ setOpenCloseSuggest }): ReactElement => {
  const updateTaskStatus = useStoreActions((actions) => actions.components.task.updateStatus);
  const isTaskAuthorLoggedIn = useStoreState((state) => state.session.isTaskAuthorLoggedIn);
  const [suggestComment, setSuggestComment] = useState<string>("");
  const suggestCloseTask = useStoreActions(
    (actions) => actions.components.task?.suggestCloseTaskRequest
  );
  const typeIn = (
    event: BaseSyntheticEvent<Event, any, HTMLTextAreaElement>
  ) => {
    setSuggestComment(event.target.value.trim());
  };
  const callbackFn = (): void => {
    // setOpenCloseSuggest.bind(null, false);
    if(isTaskAuthorLoggedIn) {
      updateTaskStatus({status: "closed"});
    }
    setOpenCloseSuggest(false);
  }

  return (
    <div className="timeline-form-wrapper">
      <div className="timeline-form timeline-form-close-suggest-comment">
        <h4>Небольшое пояснение</h4>
        <textarea
          id="close_suggest_comment"
          value={suggestComment}
          onChange={typeIn}
          placeholder="Если все сделано, то это отличный повод, завершить задачу"
        ></textarea>
        <div className="comment-action">
          <a
            href="#"
            className="cancel-comment"
            onClick={(event) => {
              event.preventDefault();
              setOpenCloseSuggest(false);
            }}
          >
            Вернуться
          </a>
          <a
            href="#"
            className="submit-comment"
            onClick={(event) => {
              event.preventDefault();
              suggestCloseTask({ suggestComment, callbackFn });
            }}
          >
            Отправить
          </a>
        </div>
      </div>
    </div>
  );
};

export default TaskTimelineOpenCloseSuggest;
