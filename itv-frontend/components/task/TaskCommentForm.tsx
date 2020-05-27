import { ReactElement } from "react";
import { getTheDate } from "../../utilities/utilities";

const TaskCommentForm: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="comment-wrapper add-comment-form-wrapper">
      <div className="comment reply">
        <div className="comment-body">
          <time>
            {getTheDate({
              dateString: new Date().toISOString(),
              stringFormat: "dd.MM.yyyy в HH:mm",
            })}
          </time>
          <textarea></textarea>
        </div>
        <a
          href="#"
          className="send-button"
          onClick={(event) => {
            event.preventDefault();
          }}
        ></a>
      </div>
    </div>
  );
};

export default TaskCommentForm;
