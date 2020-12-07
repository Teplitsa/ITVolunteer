import { ReactElement } from "react";
import MemberAvatarDefault from "../assets/img/member-default.svg";

const MemberAvatar: React.FunctionComponent<{
  memberAvatar: string;
  memberFullName?: string;
  size?: "large" | "medium" | "medium-plus" | "small";
}> = ({ memberAvatar, memberFullName = "", size = "" }): ReactElement => {
  const isDefaultAvatar = !memberAvatar || memberAvatar.search(/temp-avatar\.png/) !== -1;

  return (
    <figure
      className={`member-avatar ${isDefaultAvatar ? "member-avatar_default-image" : ""} ${
        size === "medium" ? "member-avatar_medium-size-image" : ""
      } ${
        size === "medium-plus" ? "member-avatar_medium-plus-size-image" : ""
      }`}
    >
      <img
        className={`member-avatar__image ${isDefaultAvatar ? "member-avatar__image_default" : ""}`}
        src={isDefaultAvatar ? MemberAvatarDefault : memberAvatar}
        alt={isDefaultAvatar ? "Фото участника" : memberFullName}
      />
    </figure>
  );
};

export default MemberAvatar;
