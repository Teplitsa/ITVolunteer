import { ReactElement, useState, useEffect, useRef } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { ITaskComment } from "../../model/model.typing";
import { getTheDate } from "../../utilities/utilities";
import UserCardSmall from "../UserCardSmall";
import TaskCommentForm from "./TaskCommentForm";

const TaskCommentListItem: React.FunctionComponent<ITaskComment> = ({
  id,
  author,
  dateGmt,
  content,
  likesCount,
  likers,
  likeGiven: isForbiddenTolike,
  replies,
}): ReactElement => {
  const [isCommentToReply, toggleReplyForm] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const {
    canUserReplyToComment,
    user: { id: currentUserId },
  } = useStoreState(state => state.session);
  const { commentLikeRequest, commentUnlikeRequest } = useStoreActions(
    actions => actions.components.task
  );

  const like = commentLikeRequest.bind(null, id);
  const unlike = commentUnlikeRequest.bind(null, id);

  useEffect(() => {
    if (isCommentToReply) {
      new IntersectionObserver(
        ([textArea]) => textArea.isIntersecting && textAreaRef.current.focus(),
        { rootMargin: "50% 0% 50% 0%", threshold: 1.0 }
      ).observe(textAreaRef.current);

      textAreaRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [isCommentToReply]);

  return (
    <div className="comment-wrapper">
      <div className="comment">
        <div className="comment-author">{author && <UserCardSmall {...author} />}</div>
        <div className="comment-body">
          <time>
            {getTheDate({
              dateString: dateGmt,
              stringFormat: "dd.MM.yyyy в HH:mm",
            })}
          </time>
          <div className="text" dangerouslySetInnerHTML={{ __html: content }} />
          {canUserReplyToComment && (
            <div className="meta-bar">
              <div
                className={`like ${
                  likesCount > 0
                    ? likers.some(({ userId }) => userId === currentUserId)
                      ? "like_authorized-user-liked"
                      : "like_somebody-liked"
                    : ""
                }`}
                onClick={event => {
                  event.preventDefault();
                  (isForbiddenTolike && unlike()) || like();
                }}
              >
                {likesCount}
                {likesCount > 0 && (
                  <div className="like-hint">
                    {likers
                      .reduce(
                        (likerNames, { userName, userFullName }, i) =>
                          (i < 3 && [...likerNames, userFullName || userName]) || likerNames,
                        []
                      )
                      .join(", ")}
                    {likers.length > 3 && ` и ещё ${likers.length - 3} человек`}
                  </div>
                )}
              </div>
              <div className="actions">
                {/* <a href="#" className="report d-none">
                  Пожаловаться
                </a> */}
                <a
                  href="#"
                  className="reply-comment edit"
                  onClick={event => {
                    event.preventDefault();
                    toggleReplyForm(!isCommentToReply);
                  }}
                >
                  Ответить
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      {Array.isArray(replies?.nodes) &&
        replies.nodes.map(comment => <TaskCommentListItem key={comment.id} {...comment} />)}
      {isCommentToReply && <TaskCommentForm {...{ textAreaRef, parentCommentId: id }} />}
    </div>
  );
};

export default TaskCommentListItem;
