import { ReactElement, SyntheticEvent, useRef } from "react";
import { useStoreActions } from "../../model/helpers/hooks";

const MemberUploadCover: React.FunctionComponent = (): ReactElement => {
  const coverUploadInput = useRef<HTMLInputElement>(null);
  const uploadUserCoverRequest = useStoreActions(
    (actions) => actions.components.memberAccount.uploadUserCoverRequest
  );

  const uploadCover = (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files[0]) return;

    uploadUserCoverRequest({ userCover: event.currentTarget.files[0] });
  };
  return (
    <>
      <button
        className="btn btn_upload-cover"
        type="button"
        onClick={() => coverUploadInput.current.click()}
      >
        Загрузить обложку
      </button>
      <input
        className="member-card__avatar-upload-input"
        id="member-cover-upload-input"
        type="file"
        name="avatar"
        accept="image/jpeg,image/png,image/gif"
        ref={coverUploadInput}
        onChange={uploadCover}
      />
    </>
  );
};

export default MemberUploadCover;
