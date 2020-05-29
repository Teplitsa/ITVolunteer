import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import TaskCommentForm from "./TaskCommentForm";
import TaskCommentListItem from "./TaskCommentListItem";

const TaskCommentList: React.FunctionComponent = (): ReactElement => {
  const { comments } = useStoreState((state) => state.components.task);

  return (
    <div className="comments-list">
      {(comments.length === 0 && (
        <>
          <div className="comments-list__no-items">
            Пока ещё никто не оставил комментарий. Вы можете первым
            прокомментировать задачу.
          </div>
          <TaskCommentForm />
        </>
      )) ||
        comments.map((comment) => {
          return <TaskCommentListItem key={comment.id} {...comment} />;
        })}
    </div>
  );
};

export default TaskCommentList;
