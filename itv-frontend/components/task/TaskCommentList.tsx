import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import TaskCommentListItem from "./TaskCommentListItem";

const TaskCommentList: React.FunctionComponent = (): ReactElement => {
  const { comments } = useStoreState(state => state.components.task);

  return (
    <div className="comments-list">
      {comments.map(comment => {
        return <TaskCommentListItem key={comment.id} {...comment} />;
      })}
    </div>
  );
};

export default TaskCommentList;
