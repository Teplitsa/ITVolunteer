import { ReactElement } from "react";
import Router from "next/router";
// import TaskTimelineReviewForm from "./TaskTimelineReviewForm";
import { useStoreState, useStoreActions } from "../../../../model/helpers/hooks";

const TaskTimelineReviewWrite: React.FunctionComponent = (): ReactElement => {
  const approvedDoer = useStoreState(state => state.components.task.approvedDoer);
  const reviewForDoer = useStoreState(state => state.components.task.reviews?.reviewForDoer);
  const reviewForAuthor = useStoreState(state => state.components.task.reviews?.reviewForAuthor);
  const databaseId = useStoreState(state => state.components.task.databaseId);
  const title = useStoreState(state => state.components.task.title);
  const author = useStoreState(state => state.components.task.author);
  const taskSlug = useStoreState(state => state.components.task.slug);
  const user = useStoreState(state => state.session.user);
  const isTaskAuthorLoggedIn = useStoreState(state => state.session.isTaskAuthorLoggedIn);
  const setCompleteTaskWizardState = useStoreActions(
    actions => actions.components.completeTaskWizard.setInitState
  );
  // const [isReviewFormShown, toggleReviewForm] = useState<boolean>(false);

  const writeReview = () => {
    setCompleteTaskWizardState({
      user: {
        databaseId: isTaskAuthorLoggedIn ? user.databaseId : approvedDoer.databaseId,
        name: isTaskAuthorLoggedIn ? user.fullName : approvedDoer.fullName,
        slug: user.slug,
        isAuthor: isTaskAuthorLoggedIn,
      },
      partner: {
        databaseId: isTaskAuthorLoggedIn ? approvedDoer.databaseId : author.databaseId,
        name: isTaskAuthorLoggedIn ? approvedDoer.fullName : author.fullName,
        slug: isTaskAuthorLoggedIn ? approvedDoer.slug : author.slug,
      },
      task: { databaseId, title, slug: taskSlug },
    });

    Router.push({
      pathname: "/task-complete",
    });
  };

  if (
    !(approvedDoer?.id === user.id && !reviewForAuthor) &&
    !(isTaskAuthorLoggedIn && !reviewForDoer)
  )
    return null;

  return (
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
        onClick={event => {
          event.preventDefault();
          writeReview();
          // toggleReviewForm(!isReviewFormShown);
        }}
      >
        Написать отзыв
      </a>
    </div>
    // {isReviewFormShown && (
    //   <TaskTimelineReviewForm
    //     hideReviewForm={toggleReviewForm.bind(null, false)}
    //   />
    // )}
  );
};

export default TaskTimelineReviewWrite;
