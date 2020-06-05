import { ReactElement, BaseSyntheticEvent, useState } from "react";
import { useStoreActions } from "../../../../model/helpers/hooks";

const TaskTimelineReviewForm: React.FunctionComponent<{
  hideReviewForm: () => void;
}> = ({ hideReviewForm }): ReactElement => {
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const newReviewRequest = useStoreActions(
    (actions) => actions.components.task.newReviewRequest
  );
  const typeIn = (
    event: BaseSyntheticEvent<Event, any, HTMLTextAreaElement>
  ) => {
    setReviewText(event.target.value);
  };

  return (
    <div className="timeline-form-wrapper">
      <div className="timeline-form timeline-form-review">
        <h4>Ваш отзыв о работе над задачей</h4>
        <textarea
          id="review_text"
          value={reviewText}
          onChange={typeIn}
        ></textarea>
        <div className="rating-bar">
          <h4 className="title">Оценка задачи:</h4>
          <div className="stars">
            {Array(5)
              .fill("on")
              .map((className, i) => {
                return (
                  <span
                    key={`Rating${i + 1}`}
                    className={(reviewRating > i && className) || ""}
                    onClick={(event) => {
                      event.preventDefault();
                      setReviewRating(i + 1);
                    }}
                  />
                );
              })}
          </div>
        </div>
        <div className="comment-action">
          <a
            href="#"
            className="submit-comment"
            onClick={(event) => {
              event.preventDefault();
              newReviewRequest({
                reviewRating,
                reviewText,
                callbackFn: hideReviewForm,
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

export default TaskTimelineReviewForm;
