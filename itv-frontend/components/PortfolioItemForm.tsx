import { ReactElement, FormEvent, useState } from "react";
import UploadFileInput from "./UploadFileInput";
import IconAward from "../assets/img/icon-award.svg";

interface IPortfolioItemForm {
  title?: string;
  description?: string;
  preview?: File;
  fullImage?: File;
  afterSubmitHandler: (portfolioItemData: FormData) => void;
}

const PortfolioItemForm: React.FunctionComponent<IPortfolioItemForm> = ({
  title = "",
  description = "",
  preview = null,
  fullImage = null,
  afterSubmitHandler,
}): ReactElement => {
  const [titleLength, setTitleLength] = useState<number>(0);
  const [descriptionLength, setDescriptionLength] = useState<number>(0);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    afterSubmitHandler(new FormData(event.currentTarget));
  };

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
          maxLength={150}
          placeholder="Например, Помощь в разработке баннера"
          required
          onInput={event => setDescriptionLength(event.currentTarget.value.length)}
        ></textarea>
        <div className="form__group-footer">
          <div className="form__group-footer-left"><img src={IconAward} alt="" /> +10 баллов за заполненное поле</div>
          <div className="form__group-footer-right">{descriptionLength}/150</div>
        </div>
      </div>
      <div className="form__group">
        <label className="form__label">Изображение превью</label>
        <div className="form__group-header">Желаемый размер файла 430x250px</div>
        <UploadFileInput name="preview" isMultiple={false} fileData={preview} />
        <div className="form__group-footer">
          <div className="form__group-footer-left"><img src={IconAward} alt="" /> +10 баллов за заполненное поле</div>
        </div>
      </div>
      <div className="form__group">
        <label className="form__label">Изображение в портфолио</label>
        <div className="form__group-header">Желаемый размер файла 1200px по ширине</div>
        <UploadFileInput name="full_image" isMultiple={false} fileData={fullImage} />
        <div className="form__group-footer">
          <div className="form__group-footer-left"><img src={IconAward} alt="" /> +10 баллов за заполненное поле</div>
        </div>
      </div>
      <div className="form__group">
        <button type="submit" className="btn btn_primary-extra">
          Добавить работу
        </button>
      </div>
    </form>
  );
};

export default PortfolioItemForm;
