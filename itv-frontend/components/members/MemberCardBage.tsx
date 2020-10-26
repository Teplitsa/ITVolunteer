import { ReactElement, useRef, SyntheticEvent } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberAvatar from "../MemberAvatar";

const MemberCardBage: React.FunctionComponent = (): ReactElement => {
  const avatarUploadInput = useRef<HTMLInputElement>(null);
  const isAccountOwner = useStoreState((store) => store.session.isAccountOwner);
  const {
    itvAvatar: memberAvatar,
    name: memberName,
    fullName: memberFullName,
    organizationName,
  } = useStoreState((store) => store.components.memberAccount);
  const uploadUserAvatarRequest = useStoreActions(
    (actions) => actions.components.memberAccount.uploadUserAvatarRequest
  );

  const uploadAvatar = (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files[0]) return;
    const [mimeType, imageExtension] = event.currentTarget.files[0].type.match(
      /image\/(\w+)/
    );

    uploadUserAvatarRequest({
      userAvatar: event.currentTarget.files[0],
      fileName: `${memberName}.${imageExtension}`,
    });
  };

  return (
    <div className="member-card__bage">
      <div className="member-card__avatar">
        <MemberAvatar {...{ memberAvatar, memberFullName, size: "large" }} />
        {isAccountOwner && (
          <>
            <button
              className="member-card__avatar-upload"
              type="button"
              onClick={() => avatarUploadInput.current.click()}
            >
              Загрузить изображение
            </button>
            <input
              className="member-card__avatar-upload-input"
              id="member-avatar-upload-input"
              type="file"
              name="avatar"
              accept="image/jpeg,image/png,image/gif"
              ref={avatarUploadInput}
              onChange={uploadAvatar}
            />
          </>
        )}
      </div>
      <div className="member-card__name">{memberFullName}</div>
      {organizationName && (
        <div className="member-card__role">Представитель организации</div>
      )}
    </div>
  );
};

export default MemberCardBage;
