import { ReactElement, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import TaskCommentList from "./TaskCommentList";
import Loader from "../Loader";

const TaskComments: React.FunctionComponent = (): ReactElement => {
  const { isTaskAuthorLoggedIn } = useStoreState((state) => state.session);
  const {
    databaseId: taskDatabaseId,
    author: { fullName: authorName },
    comments,
  } = useStoreState((state) => state.components.task);
  const commentsRequest = useStoreActions(
    (actions) => actions.components.task.commentsRequest
  );

  useEffect(() => {
    isTaskAuthorLoggedIn && commentsRequest(taskDatabaseId);
  }, [isTaskAuthorLoggedIn, commentsRequest, taskDatabaseId]);

  return (
    isTaskAuthorLoggedIn && (
      <div className="task-comments">
        <h3>Комментарии</h3>
        <p className="comments-intro">{`${authorName} будет рад услышать ваш совет, вопрос или предложение.`}</p>
        {(Array.isArray(comments) && comments.length > 0 && (
          <TaskCommentList />
        )) || <Loader />}
      </div>
    )
  );
};

export default TaskComments;
