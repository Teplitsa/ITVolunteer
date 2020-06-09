import { ReactElement, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import TaskCommentList from "./TaskCommentList";
import TaskCommentsIntro from "./TaskCommentsIntro";
import TaskCommentForm from "./TaskCommentForm";
import Loader from "../Loader";

const TaskComments: React.FunctionComponent = (): ReactElement => {
  const canUserReplyToComment = useStoreState(
    (state) => state.session.canUserReplyToComment
  );
  const {
    author: { fullName: authorName },
    comments,
  } = useStoreState((state) => state.components.task);
  const commentsRequest = useStoreActions(
    (actions) => actions.components.task.commentsRequest
  );

  useEffect(() => {
    commentsRequest();
  }, [commentsRequest]);

  return (
    <div className="task-comments">
      <h3>Комментарии</h3>

      {(Array.isArray(comments) &&
        ((comments.length > 0 && (
          <>
            {canUserReplyToComment && (
              <>
                <TaskCommentsIntro>
                  {`${authorName} будет рад услышать ваш совет, вопрос или предложение.`}
                </TaskCommentsIntro>
                <div className="comments-list">
                  <TaskCommentForm />
                </div>
              </>
            )}
            <TaskCommentList />
          </>
        )) || (
          <>
            <TaskCommentsIntro>
              {`Пока никто не оставил комментарии к этой задаче.`}
            </TaskCommentsIntro>
            <div className="comments-list">
              <TaskCommentForm />
            </div>
          </>
        ))) || <Loader />}
    </div>
  );
};

export default TaskComments;
