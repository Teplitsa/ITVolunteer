import { ReactElement, useState } from "react";
import TaskTimelineReviewForm from "./TaskTimelineReviewForm";
import { useStoreState } from "../../../../model/helpers/hooks";

const TaskTimelineReviewWrite: React.FunctionComponent = (): ReactElement => {
  const approvedDoer = useStoreState(
    (state) => state.components.task?.approvedDoer
  );
  const reviewForDoer = useStoreState(
    (state) => state.components.task?.reviews?.reviewForDoer
  );
  const reviewForAuthor = useStoreState(
    (state) => state.components.task?.reviews?.reviewForAuthor
  );
  const { user, isTaskAuthorLoggedIn } = useStoreState(
    (state) => state.session
  );
  const [isReviewFormShown, toggleReviewForm] = useState<boolean>(false);

  return (
    ((approvedDoer?.id === user.id && !reviewForAuthor) ||
      (isTaskAuthorLoggedIn && !reviewForDoer)) && (
      <>
        <div className="comment-actions">
          {!reviewForDoer && !reviewForAuthor && (
            <div className="first-review-description">
              Оставьте свой отзыв. Он важен для получения обратной связи
            </div>
          )}
          <a
            href="#"
            className={`action add-review${
              (!reviewForDoer && !reviewForAuthor && " first-review") || ""
            }`}
            onClick={(event) => {
              event.preventDefault();
              toggleReviewForm(!isReviewFormShown);
            }}
          >
            Написать отзыв
          </a>
        </div>
        {isReviewFormShown && (
          <TaskTimelineReviewForm
            hideReviewForm={toggleReviewForm.bind(null, false)}
          />
        )}
      </>
    )
  );
};

export default TaskTimelineReviewWrite;
