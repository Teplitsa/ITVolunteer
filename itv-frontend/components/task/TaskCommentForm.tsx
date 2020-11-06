import { ReactElement, MutableRefObject, useState, BaseSyntheticEvent } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { getTheDate } from "../../utilities/utilities";

const TaskCommentForm: React.FunctionComponent<{
  textAreaRef?: MutableRefObject<HTMLTextAreaElement>;
  parentCommentId?: string;
}> = ({ textAreaRef = null, parentCommentId = "" }): ReactElement => {
  const [commentText, setCommentText] = useState<string>("");
  const canUserReplyToComment = useStoreState(state => state.session.canUserReplyToComment);
  const newCommentRequest = useStoreActions(state => state.components.task.newCommentRequest);
  const typeIn = (event: BaseSyntheticEvent<Event, any, HTMLTextAreaElement>) => {
    setCommentText(event.target.value);
  };
  const publishComment = newCommentRequest.bind(null, {
    parentCommentId,
    commentBody: commentText,
    callbackFn: setCommentText.bind(null, ""),
  });

  return (
    canUserReplyToComment && (
      <div className="comment-wrapper add-comment-form-wrapper">
        <div className="comment reply">
          <div className="comment-body">
            <time>
              {getTheDate({
                dateString: new Date().toISOString(),
                stringFormat: "dd.MM.yyyy в HH:mm",
              })}
            </time>
            <textarea ref={textAreaRef} value={commentText} onChange={typeIn}></textarea>
          </div>
          <a
            href="#"
            className="send-button"
            onClick={event => {
              event.preventDefault();
              publishComment();
            }}
          ></a>
        </div>
      </div>
    )
  );
};

export default TaskCommentForm;
