import { ReactElement, FormEvent, useState, useEffect } from "react";
import UploadFileInput from "./UploadFileInput";
import { IMediaData, getMediaData } from "../utilities/media";
import { IPortfolioItemFormProps } from "../model/model.typing";

const PortfolioItemForm: React.FunctionComponent<IPortfolioItemFormProps> = ({
  title = "",
  description = "",
  preview = 0,
  fullImage = 0,
  submitBtnTitle: SubmitBtnTitle,
  afterSubmitHandler,
}): ReactElement => {
  const [titleLength, setTitleLength] = useState<number>(title.trim().length);
  const [descriptionLength, setDescriptionLength] = useState<number>(description.trim().length);
  const [previewObject, setPreviewObject] = useState<number | IMediaData>(preview);
  const [fullImageObject, setFullImageObject] = useState<number | IMediaData>(fullImage);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    afterSubmitHandler(new FormData(event.currentTarget));
  };

  useEffect(() => {
    preview > 0 &&
      (async () => {
        const fileData = await getMediaData(preview);

        setPreviewObject(fileData);
      })();

    fullImage > 0 &&
      (async () => {
        const fileData = await getMediaData(fullImage);

        setFullImageObject(fileData);
      })();
  }, []);

  return (
    <form className="form" onSubmit={submitHandler}>
      <div className="form__group">
        <label className="form__label">
          Название работы <span className="form__required">*</span>
        </label>
        <input
          className="form__control_input form__control_full-width"
          type="text"
          name="title"
          maxLength={50}
          defaultValue={title}
          placeholder="Например, «Разработка баннера»"
          required
          onInput={event => setTitleLength(event.currentTarget.value.length)}
        />
        <div className="form__group-footer">
          <div className="form__group-footer-right">{titleLength}/50</div>
        </div>
      </div>
      <div className="form__group">
        <label className="form__label">
          Описание работы <span className="form__required">*</span>
        </label>
        <textarea
          className="form__control_textarea form__control_full-width"
          name="description"
          defaultValue={description}
          maxLength={450}
          placeholder="Например, Помощь в разработке баннера"
          required
          onInput={event => setDescriptionLength(event.currentTarget.value.length)}
        ></textarea>
        <div className="form__group-footer">
          <div className="form__group-footer-right">{descriptionLength}/450</div>
        </div>
      </div>
      <div className="form__group">
        <label className="forloadFileDatam__label">Изображение превью</label>
        <div className="form__group-header">Желаемый размер файла 430x250px</div>
        <UploadFileInput name="preview" isMultiple={false} fileData={previewObject} />
      </div>
      <div className="form__group">
        <label className="form__label">Изображение в портфолио</label>
        <div className="form__group-header">Желаемый размер файла 1200px по ширине</div>
        <UploadFileInput name="full_image" isMultiple={false} fileData={fullImageObject} />
      </div>
      <div className="form__group">
        <button type="submit" className="btn btn_primary-extra">
          <SubmitBtnTitle />
        </button>
      </div>
    </form>
  );
};

export default PortfolioItemForm;
