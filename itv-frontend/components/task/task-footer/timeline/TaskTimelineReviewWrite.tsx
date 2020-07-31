import { ReactElement, useState } from "react";
import Router from "next/router";
// import TaskTimelineReviewForm from "./TaskTimelineReviewForm";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";

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
  const { databaseId, title } = useStoreState((state) => state.components.task);
  const { user, isTaskAuthorLoggedIn } = useStoreState(
    (state) => state.session
  );
  const setCompleteTaskWizardState = useStoreActions(
    (actions) => actions.components.completeTaskWizard.setInitState
  );
  // const [isReviewFormShown, toggleReviewForm] = useState<boolean>(false);

  const writeReview = () => {
    setCompleteTaskWizardState({
      user: {
        databaseId: isTaskAuthorLoggedIn
          ? user.databaseId
          : approvedDoer.databaseId,
        name: isTaskAuthorLoggedIn ? user.fullName : approvedDoer.fullName,
        isAuthor: isTaskAuthorLoggedIn,
      },
      partner: {
        databaseId: isTaskAuthorLoggedIn
          ? approvedDoer.databaseId
          : user.databaseId,
        name: isTaskAuthorLoggedIn ? approvedDoer.fullName : user.fullName,
      },
      task: { databaseId, title },
    });

    Router.push({
      pathname: "/task-complete",
    });
  };

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
              writeReview();
              // toggleReviewForm(!isReviewFormShown);
            }}
          >
            Написать отзыв
          </a>
        </div>
        {/* {isReviewFormShown && (
          <TaskTimelineReviewForm
            hideReviewForm={toggleReviewForm.bind(null, false)}
          />
        )} */}
      </>
    )
  );
};

export default TaskTimelineReviewWrite;
