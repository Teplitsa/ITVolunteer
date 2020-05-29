import { ReactElement, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import TaskCommentList from "./TaskCommentList";
import Loader from "../Loader";

const TaskComments: React.FunctionComponent = (): ReactElement => {
  const { isTaskAuthorLoggedIn } = useStoreState((state) => state.session);
  const {
    author: { fullName: authorName },
    comments,
  } = useStoreState((state) => state.components.task);
  const commentsRequest = useStoreActions(
    (actions) => actions.components.task.commentsRequest
  );

  useEffect(() => {
    isTaskAuthorLoggedIn && commentsRequest();
  }, [isTaskAuthorLoggedIn, commentsRequest]);

  return (
    isTaskAuthorLoggedIn && (
      <div className="task-comments">
        <h3>Комментарии</h3>
        <p className="comments-intro">{`${authorName} будет рад услышать ваш совет, вопрос или предложение.`}</p>
        {(Array.isArray(comments) && <TaskCommentList />) || <Loader />}
      </div>
    )
  );
};

export default TaskComments;
