import { ReactElement } from "react";
import { convertObjectToClassName } from "../utilities/utilities";
import MemberAvatarDefault from "../assets/img/member-default.svg";

const MemberAvatar: React.FunctionComponent<{
  memberAvatar: string;
  memberFullName?: string;
  size?: "large" | "medium" | "medium-plus" | "small";
  isPasekaMember?: boolean;
}> = ({ memberAvatar, memberFullName = "", size = "", isPasekaMember = false }): ReactElement => {
  const isDefaultAvatar = !memberAvatar || memberAvatar.search(/temp-avatar\.png/) !== -1;

  return (
    <figure
      className={convertObjectToClassName({
        "member-avatar": true,
        "member-avatar_default-image": isDefaultAvatar,
        "member-avatar_medium-size-image": size === "medium",
        "member-avatar_medium-plus-size-image": size === "medium-plus",
        "member-avatar_paseka-member": isPasekaMember,
      })}
    >
      <img
        className={convertObjectToClassName({
          "member-avatar__image": true,
          "member-avatar__image_default": isDefaultAvatar,
        })}
        src={isDefaultAvatar ? MemberAvatarDefault : memberAvatar}
        alt={isDefaultAvatar ? "Фото участника" : memberFullName}
      />
    </figure>
  );
};

export default MemberAvatar;
