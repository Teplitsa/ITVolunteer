import { ReactElement, useState, useEffect } from "react";
import IconBriefcase from "../assets/img/icon-briefcase.svg";
import MemberAvatarDefault from "../assets/img/member-default.svg";

export const UserSmallView: React.FunctionComponent<{
  user: {
    itvAvatar?: string;
    fullName: string;
    memberRole: string;
  };
}> = ({ user }): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    try {
      user?.itvAvatar &&
        user.itvAvatar.search(/temp-avatar\.png/) === -1 &&
        fetch(user.itvAvatar, {
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
            isAvatarImageValid ? "" : "avatar-wrapper_default-image"
          }`}
          style={{
            backgroundImage: isAvatarImageValid
              ? `url(${user.itvAvatar})`
              : `url(${
                  user.memberRole === "Организация"
                    ? IconBriefcase
                    : MemberAvatarDefault
                })`,
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
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    try {
      user?.itvAvatar &&
        user.itvAvatar.search(/temp-avatar\.png/) === -1 &&
        fetch(user.itvAvatar, {
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
            isAvatarImageValid ? "" : "avatar-wrapper_medium-image"
          }`}
          style={{
            backgroundImage: isAvatarImageValid
              ? `url(${user.itvAvatar})`
              : `url(${MemberAvatarDefault})`,
          }}
        />
      </div>
    )
  );
};
