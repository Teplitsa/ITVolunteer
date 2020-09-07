import { ReactElement, useState, useEffect } from "react";
import IconBriefcase from "../assets/img/icon-briefcase.svg";

export const UserSmallView: React.FunctionComponent<{
  user: {
    itvAvatar?: string;
    fullName: string;
    memberRole: string;
  };
}> = ({ user }): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  const avatarUrl = isAvatarImageValid
    ? user?.itvAvatar
    : user?.memberRole === "Организация"
    ? IconBriefcase
    : "none";

  useEffect(() => {
    const abortController = new AbortController();

    try {
      user?.itvAvatar &&
        fetch(user?.itvAvatar, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then((response) => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

  return (
    user && (
      <div className="itv-user-small-view">
        <span
          className={`avatar-wrapper ${
            !isAvatarImageValid && user.memberRole === "Организация"
              ? "avatar-wrapper_default-image"
              : ""
          }`}
          style={{
            backgroundImage: `url(${avatarUrl})`,
          }}
        />
        <span className="name">
          <span dangerouslySetInnerHTML={{ __html: user.fullName }} />
          &nbsp;/&nbsp;{user.memberRole}
        </span>
      </div>
    )
  );
};

export const UserSmallPicView: React.FunctionComponent<{
  user: {
    itvAvatar?: string;
  };
}> = ({ user }) => {
  return (
    user && (
      <div className="itv-user-small-view">
        <span
          className="avatar-wrapper"
          style={{
            backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
          }}
        />
      </div>
    )
  );
};
