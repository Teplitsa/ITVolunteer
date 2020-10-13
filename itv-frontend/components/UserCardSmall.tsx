import { ReactElement, useState, useEffect } from "react";
import { ITaskCommentAuthor } from "../model/model.typing";
import MemberAvatarDefault from "../assets/img/member-default.svg";

const UserCardSmall: React.FunctionComponent<ITaskCommentAuthor> = ({
  fullName,
  itvAvatar: avatarImage,
  memberRole,
}): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    try {
      avatarImage &&
        avatarImage.search(/temp-avatar\.png/) === -1 &&
        fetch(avatarImage, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then((response) => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

  return (
    <div className="itv-user-small-view">
      <span
        className={`avatar-wrapper ${
          isAvatarImageValid ? "" : "avatar-wrapper_default-image"
        }`}
        style={{
          backgroundImage: isAvatarImageValid
            ? `url(${avatarImage})`
            : `url(${MemberAvatarDefault})`,
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
