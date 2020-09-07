import { ReactElement } from "react";
import { isLinkValid } from "../utilities/utilities";
import IconBriefcase from "../assets/img/icon-briefcase.svg";

export const UserSmallView: React.FunctionComponent<{
  user: {
    itvAvatar?: string;
    fullName: string;
    memberRole: string;
  };
}> = ({ user }): ReactElement => {
  const avatarUrl = isLinkValid(user?.itvAvatar)
    ? user?.itvAvatar
    : user?.memberRole === "Организация"
    ? IconBriefcase
    : "none";

  return (
    user && (
      <div className="itv-user-small-view">
        <span
          className={`avatar-wrapper ${
            !isLinkValid(user?.itvAvatar) && user?.memberRole === "Организация"
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
