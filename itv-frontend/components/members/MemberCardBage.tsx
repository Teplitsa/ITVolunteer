import { ReactElement, useRef, SyntheticEvent } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import MemberCardAvatar from "../../assets/img/pic-member-card-avatar.svg";

const MemberCardBage: React.FunctionComponent = (): ReactElement => {
  const avatarUploadInput = useRef<HTMLInputElement>(null);
  const memberName = useStoreState((store) => store.session.user.username);

  const uploadAvatar = (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files[0]) return;

    const formData = new FormData();
    const [mimeType, imageExtension] = event.currentTarget.files[0].type.match(
      /image\/(\w+)/
    );

    formData.append(
      "avatar",
      event.currentTarget.files[0],
      `${memberName}.jpg`
    );
  };

  return (
    <div className="member-card__bage">
      <div className="member-card__avatar">
        <figure className="member-card__avatar-image-container">
          <img
            className="member-card__avatar-image"
            src={MemberCardAvatar}
            alt="Фото участника"
          />
        </figure>
        <button
          className="member-card__avatar-upload"
          type="button"
          onClick={() => avatarUploadInput.current.click()}
        >
          Загрузить изображение
        </button>
        <input
          className="member-card__avatar-upload-input"
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/gif"
          ref={avatarUploadInput}
          onChange={uploadAvatar}
        />
      </div>
      <div className="member-card__name">Александр Токарев</div>
      <div className="member-card__role">Представитель организации</div>
    </div>
  );
};

export default MemberCardBage;
