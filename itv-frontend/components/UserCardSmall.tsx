import { ReactElement } from "react";
import { ITaskCommentAuthor } from "../model/model.typing";

const UserCardSmall: React.FunctionComponent<ITaskCommentAuthor> = ({
  fullName,
  itvAvatar: avatarImage,
  memberRole,
}): ReactElement => {
  return (
    <div className="itv-user-small-view">
      <span
        className="avatar-wrapper"
        style={{
          backgroundImage:
            avatarImage && avatarImage.search(/temp-avatar\.png/) === -1
              ? `url(${avatarImage})`
              : "none",
        }}
      />

      <span className="name">
        <span dangerouslySetInnerHTML={{ __html: fullName }} />
        {memberRole && ` / ${memberRole}`}
      </span>
    </div>
  );
};

export default UserCardSmall;
