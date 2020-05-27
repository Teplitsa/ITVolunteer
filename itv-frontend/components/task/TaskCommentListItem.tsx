import { ReactElement, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { ITaskComment } from "../../model/model.typing";
import { getTheDate } from "../../utilities/utilities";
import TaskCommentAuthor from "./TaskCommentAuthor";
import TaskCommentForm from "./TaskCommentForm";

const TaskCommentListItem: React.FunctionComponent<ITaskComment> = ({
  id,
  author,
  dateGmt,
  content,
  likesCount,
  likeGiven: isForbiddenTolike,
  replies,
}): ReactElement => {
  const [isCommentToReply, toggleReplyForm] = useState<boolean>(false);
  const canUserReplyToComment = useStoreState(
    (state) => state.session.canUserReplyToComment
  );
  const commentLikeRequest = useStoreActions(
    (actions) => actions.components.task?.commentLikeRequest
  );
  const like = commentLikeRequest.bind(null, id);

  return (
    <div className="comment-wrapper">
      <div className="comment">
        <div className="comment-author">
          {author && <TaskCommentAuthor {...author} />}
        </div>
        <div className="comment-body">
          <time>
            {getTheDate({
              dateString: new Date(dateGmt).toISOString(),
              stringFormat: "dd.MM.yyyy в HH:mm",
            })}
          </time>
          <div className="text" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="meta-bar">
            <div
              className="like"
              onClick={(event) => {
                event.preventDefault();
                !isForbiddenTolike && like();
              }}
            >
              {likesCount}
            </div>
            <div className="actions">
              <a href="#" className="report d-none">
                Пожаловаться
              </a>
              <a
                href="#"
                className="reply-comment edit"
                onClick={(event) => {
                  event.preventDefault();
                  toggleReplyForm(!isCommentToReply);
                }}
              >
                Ответить
              </a>
            </div>
          </div>
        </div>
      </div>
      {replies.nodes.map((comment) => (
        <TaskCommentListItem key={comment.id} {...comment} />
      ))}
      {canUserReplyToComment && isCommentToReply && <TaskCommentForm />}
    </div>
  );
};

export default TaskCommentListItem;
