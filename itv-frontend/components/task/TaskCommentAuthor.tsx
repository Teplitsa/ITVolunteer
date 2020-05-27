import { ReactElement } from "react";
import { ITaskCommentAuthor } from "../../model/model.typing";

const TaskCommentAuthor: React.FunctionComponent<ITaskCommentAuthor> = ({
  fullName,
  itvAvatar: avatarImage,
  memberRole,
}): ReactElement => {
  return (
    <div className="itv-user-small-view">
      <span
        className="avatar-wrapper"
        style={{
          backgroundImage: avatarImage ? `url(${avatarImage})` : "none",
        }}
      />

      <span className="name">
        <span>{fullName}</span>/{memberRole}
      </span>
    </div>
  );
};

export default TaskCommentAuthor;
