import { ReactElement, SyntheticEvent, useRef } from "react";

const MemberUploadCover: React.FunctionComponent = (): ReactElement => {
  const coverUploadInput = useRef<HTMLInputElement>(null);

  const uploadCover = (event: SyntheticEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files[0]) return;

    const formData = new FormData();

    formData.append("cover", event.currentTarget.files[0]);
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
