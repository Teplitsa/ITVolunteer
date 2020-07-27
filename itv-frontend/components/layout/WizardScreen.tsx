import { ReactElement, useState, useEffect, useRef } from "react";
import * as _ from "lodash";

import {
  IWizardScreenProps,
  IWizardInputProps,
  IFetchResult,
} from "../../model/model.typing";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import * as utils from "../../utilities/utilities";

import logo from "../../assets/img/pic-logo-itv.svg";
import closeModalIcon from "../../assets/img/icon-wizard-modal-close.svg";
import radioCheckOn from "../../assets/img/icon-wizard-radio-on.svg";
import radioCheckOff from "../../assets/img/icon-wizard-radio-off.svg";
import selectGalka from "../../assets/img/icon-wizard-select-galka.svg";
import selectItemRemove from "../../assets/img/icon-select-item-remove.svg";
import cloudUpload from "../../assets/img/icon-wizard-cloud-upload.svg";

export const WizardScreen = ({ children, ...props }): ReactElement => {
  const showScreenHelpModalState = useStoreState(
    (state) => state.components.createTaskWizard.showScreenHelpModalState
  );

  const defaultProps = {
    isShowHeader: true,
    modifierClassNames: [],
  };
  props = { ...defaultProps, ...props };

  return (
    <main
      className={`wizard wizard_ornament ${props.modifierClassNames.join(" ")}`}
    >
      <div className="wizard__container">
        {props.isShowHeader && (
          <header className="wizard__header">
            <a href="/">
              <img src={logo} className="wizard__logo" alt="IT-волонтер" />
            </a>
          </header>
        )}

        <div className="wizard__content">{children}</div>

        {_.get(showScreenHelpModalState, props.screenName, false) && (
          <WizardHelpModal {...props} />
        )}
      </div>
    </main>
  );
};

export const WizardScreenBottomBar = (props: IWizardScreenProps) => {
  function handleNextClick(e) {
    e.preventDefault();
    props.goNextStep();
  }

  function handlePrevClick(e) {
    e.preventDefault();
    props.goPrevStep();
  }

  return (
    <div className="wizard-bottom-bar">
      <div className="wizard-bottom-bar__container">
        <div className="wizard-bottom-bar__title">
          {!!props.icon && <img src={props.icon} alt="icon" />}
          {!!props.title && <span>{props.title}</span>}
        </div>
        <div>
          {/*
          #DEBUG#
          <br />
          <a href="#" onClick={handleNextClick}>Далее</a>
          <br />
          <a href="#" onClick={handlePrevClick}>Назад</a>
          */}
        </div>
        <div className="wizard-progressbar">
          <div className="wizard-progressbar__fraction">{`${props.visibleStep}/${props.visibleStepsCount}`}</div>
          <div className="wizard-progressbar__total">
            <div
              className="wizard-progressbar__complete"
              style={{
                width: `${
                  (100 * props.visibleStep) / props.visibleStepsCount
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WizardForm = ({ children, ...props }) => {
  return (
    <div className="wizard-form">
      <WizardFormTitle {...(props as IWizardScreenProps)} />
      {children}
      <WizardFormActionBar {...(props as IWizardScreenProps)} />
    </div>
  );
};

export const WizardFormActionBar = (props: IWizardScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleNextClick = (e) => {
    e.preventDefault();

    let isMayGoNextStep = props.onNextClick ? props.onNextClick(props) : true;

    if (isMayGoNextStep) {
      if (props.visibleStep < props.visibleStepsCount) {
        props.goNextStep();
      } else if (props.onWizardComplete) {
        setIsLoading(true);
        props.onWizardComplete();
      }
    }
  };

  const handlePrevClick = (e) => {
    e.preventDefault();

    if (props.visibleStep === 1) {
      document.location.href = "/tasks/";
      return;
    }

    let isMayGoPrevStep = props.onPrevClick ? props.onPrevClick(props) : true;
    if (isMayGoPrevStep) {
      props.goPrevStep();
    }
  };

  return (
    <div className="wizard-form-action-bar">
      {isLoading && (
        <div className="wizard-loading">
          <div className="spinner-border" role="status"></div>
        </div>
      )}
      {!isLoading && (
        <a
          href="#"
          onClick={handleNextClick}
          className="wizard-form-action-bar__primary-button"
        >
          Продолжить
        </a>
      )}
      {!isLoading && !!props.isAllowPrevButton && (
        <a
          href="#"
          onClick={handlePrevClick}
          className="wizard-form-action-bar__secondary-button"
        >
          {props.visibleStep > 1 ? "Вернуться" : "Отмена"}
        </a>
      )}
    </div>
  );
};

export const WizardFormTitle = (props: IWizardScreenProps) => {
  return (
    <h1 className="wizard-form__title">
      <span className="wizard-form__title-index">{props.visibleStep}</span>
      {props.title}
      {props.isRequired && (
        <span className="wizard-form__required-star">*</span>
      )}
    </h1>
  );
};

/*
 *  Fields
 */
export const WizardHelpModal = (props: IWizardScreenProps) => {
  const setShowScreenHelpModalState = useStoreActions(
    (actions) => actions.components.createTaskWizard.setShowScreenHelpModalState
  );

  function handleCloseClick(e) {
    e.preventDefault();
    setShowScreenHelpModalState({ [props.screenName]: false });
  }

  console.log("props.screenName:", props.screenName);

  return (
    <div className="wizard-help-modal">
      <header>
        <div className="wizard-help-modal__path-wrapper">
          <ul className="wizard-help-modal__path">
            <li>Справочный центр</li>
            <li>Советы для организаций</li>
            <li>Составление задачи на ITV</li>
          </ul>
          <div className="wizard-help-modal__path-overlay"></div>
        </div>
        <a
          href="#"
          className="wizard-help-modal__close"
          onClick={handleCloseClick}
        >
          <img src={closeModalIcon} />
        </a>
      </header>
      <div className="wizard-help-modal-article">
        <div className="wizard-help-modal-article__content">
          <article>
            <h1>Как правильно дать название задачи?</h1>
            <p>
              Хороший заголовок содержит в себе краткое и точное описание
              задачи, с учетом её специфики.
            </p>
            <p>
              Например: «сделать сайт благотворительной организации» — плохой
              заголовок. «Настроить сайт на WP для поиска пропавших граждан
              РФ» — лучше.
            </p>
            <p>
              В хорошем заголовке должны быть указана желаемая технология,
              например:
            </p>
            <ul>
              <li>сайт на WP</li>
              <li>приложение под андроид</li>
              <li>макет в EPS</li>
              <li>и так далее.</li>
            </ul>
            <p>Указание на то, для чего это всё (кратко, в два-три слова):</p>
            <ul>
              <li>поиск граждан,</li>
              <li>помощь детям,</li>
              <li>помощь домашним животным,</li>
              <li>помощь врачам.</li>
            </ul>
            <p>
              Хороший заголовок содержит в себе краткое и точное описание
              задачи, с учетом её специфики.
            </p>
            <p>
              Например: «сделать сайт благотворительной организации» — плохой
              заголовок. «Настроить сайт на WP для поиска пропавших граждан
              РФ» — лучше.
            </p>
            <p>
              Хороший заголовок содержит в себе краткое и точное описание
              задачи, с учетом её специфики.
            </p>
            <p>
              Например: «сделать сайт благотворительной организации» — плохой
              заголовок. «Настроить сайт на WP для поиска пропавших граждан
              РФ» — лучше.
            </p>
            <p>
              Хороший заголовок содержит в себе краткое и точное описание
              задачи, с учетом её специфики.
            </p>
            <p>
              Например: «сделать сайт благотворительной организации» — плохой
              заголовок. «Настроить сайт на WP для поиска пропавших граждан
              РФ» — лучше.
            </p>
          </article>
        </div>
        <div className="wizard-help-modal-article__content-overlay"></div>
      </div>
      <footer>
        <a href="#" className="contact-admin">
          Всё ещё нужна помощь? Напишите администратору
        </a>
      </footer>
    </div>
  );
};

export const WizardLimitedTextFieldWithHelp = ({ field: Field, ...props }) => {
  const inputUseRef = useRef(null);
  const fieldValue = _.get(props.formData, props.name, "");
  const [inputTextLength, setInputTextLength] = useState(fieldValue.length);

  function handleInput(e) {
    setInputTextLength(e.target.value.length);

    if (!!props.setFormData) {
      props.setFormData({ [props.name]: e.target.value });
    }
  }

  return (
    <div className="wizard-field">
      <Field
        name={props.name}
        placeholder={props.placeholder}
        handleInput={handleInput}
        inputUseRef={inputUseRef}
        value={fieldValue}
        selectOptions={props.selectOptions}
        customOptions={props.customOptions}
      />
      {(!!props.formHelpComponent || props.maxLength > 0) && (
        <div className="wizard-field__limit-help">
          {!!props.formHelpComponent && <props.formHelpComponent {...props} />}
          {!props.formHelpComponent && <div />}
          {props.maxLength > 0 && (
            <div className="wizard-field__limit">{`${inputTextLength}/${props.maxLength}`}</div>
          )}
        </div>
      )}
    </div>
  );
};

// input text
export const WizardStringField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardStringFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardStringFieldInput = (props: IWizardInputProps) => {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      onKeyDown={props.handleInput}
      ref={props.inputUseRef}
      defaultValue={props.value}
    />
  );
};

// textarea
export const WizardTextField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardTextFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardTextFieldInput = (props: IWizardInputProps) => {
  return (
    <textarea
      placeholder={props.placeholder}
      onKeyUp={props.handleInput}
      ref={props.inputUseRef}
      defaultValue={props.value}
    ></textarea>
  );
};

// radio
export const WizardRadioSetField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardRadioSetFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardRadioSetFieldInput = (props: IWizardInputProps) => {
  const formData = useStoreState(
    (state) => state.components.createTaskWizard.formData
  );
  const setFormData = useStoreActions(
    (actions) => actions.components.createTaskWizard.setFormData
  );

  function handleOptionClick(e, value) {
    _.set(formData, props.name + ".value", String(value));
    setFormData(formData);
  }

  return (
    <div className="wizard-radio-option-set">
      {props.selectOptions.map((option, index) => {
        return (
          <div
            className="wizard-radio-option"
            key={index}
            onClick={(e) => {
              handleOptionClick(e, option.value);
            }}
          >
            <div className="wizard-radio-option__check">
              <img
                src={
                  _.get(formData, props.name + ".value", "") ===
                  String(option.value)
                    ? radioCheckOn
                    : radioCheckOff
                }
              />
            </div>
            <span className="wizard-radio-option__title">{option.title}</span>
          </div>
        );
      })}
      {Array.isArray(props.customOptions) &&
        props.customOptions.map((CustomOption, index) => {
          return (
            <div key={index}>
              <CustomOption {...props} />
            </div>
          );
        })}
    </div>
  );
};

export const WizardSelectField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardSelectFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardSelectFieldInput = (props: IWizardInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const formData = useStoreState(
    (state) => state.components.createTaskWizard.formData
  );
  const setFormData = useStoreActions(
    (actions) => actions.components.createTaskWizard.setFormData
  );

  function handleOptionClick(e, index) {
    let fd = { ...formData };
    _.set(fd, props.name + ".index", index);
    let selectedOption = props.selectOptions[index];
    _.set(fd, props.name + ".value", String(selectedOption.value));
    setFormData({ ...fd });
    setIsOpen(false);
  }

  function handleBoxClick(e) {
    setIsOpen(!isOpen);
  }

  function getSelectedOptionIndex() {
    return _.get(formData, props.name + ".index", null);
  }

  function getSelectedOption() {
    let index = getSelectedOptionIndex();
    return index !== null ? props.selectOptions[index] : null;
  }

  function getSelectedOptionValue() {
    let option = getSelectedOption();
    return option ? _.get(option, "value", "") : "";
  }

  function getSelectedOptionTitle() {
    let option = getSelectedOption();
    return option ? _.get(option, "title", "") : "";
  }

  return (
    <div className="wizard-select">
      <div className="wizard-select__box" onClick={handleBoxClick}>
        <div className="wizard-select__box__title">
          {getSelectedOptionTitle()}
        </div>
        <div className="wizard-select__box__galka">
          <img src={selectGalka} />
        </div>
      </div>
      {isOpen && (
        <ul className="wizard-select__list">
          {props.selectOptions.map((option, index) => {
            return (
              <li
                key={index}
                className="wizard-select__list__item"
                onClick={(e) => {
                  handleOptionClick(e, index);
                }}
              >
                {option.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const WizardMultiSelectField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardMultiSelectFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardMultiSelectFieldInput = (props: IWizardInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const formData = useStoreState(
    (state) => state.components.createTaskWizard.formData
  );
  const setFormData = useStoreActions(
    (actions) => actions.components.createTaskWizard.setFormData
  );

  function handleOptionClick(e, index) {
    let fd = { ...formData };

    let selectedValueList = _.get(fd, props.name + ".value", []);
    if (!Array.isArray(selectedValueList)) {
      selectedValueList = [];
    }
    let selectedOption = _.get(props.selectOptions[index], "value", "");
    selectedValueList = _.uniq([
      ...selectedValueList,
      ...[String(selectedOption)],
    ]);

    _.set(fd, props.name + ".value", selectedValueList);
    setFormData({ ...fd });
    setIsOpen(false);
  }

  function handleRemoveItemClick(e) {
    e.stopPropagation();
    console.log("formData:", formData);
    let value = e.target.dataset.value;
    console.log("value:", value);

    let fd = { ...formData };

    let selectedValueList = _.get(fd, props.name + ".value", []);
    if (!Array.isArray(selectedValueList)) {
      selectedValueList = [];
    }
    selectedValueList = selectedValueList.filter((item) => item !== value);
    console.log("selectedValueList:", selectedValueList);

    _.set(fd, props.name + ".value", selectedValueList);
    setFormData({ ...fd });
  }

  function handleBoxClick(e) {
    setIsOpen(!isOpen);
  }

  function getSelectedOptions() {
    let selectedValueList = _.get(formData, props.name + ".value", []);
    if (!Array.isArray(selectedValueList)) {
      selectedValueList = [];
    }
    return props.selectOptions.filter(
      (item, i) =>
        selectedValueList.findIndex((value) => String(item.value) === value) >
        -1
    );
  }

  return (
    <div className="wizard-select">
      <div className="wizard-select__box" onClick={handleBoxClick}>
        <div className="wizard-select__box__selected-set">
          {getSelectedOptions().map((option, index) => {
            return (
              <div key={index} className="wizard-select__box__selected-item">
                <span>{option.title}</span>
                <img
                  src={selectItemRemove}
                  onClick={handleRemoveItemClick}
                  data-value={option.value}
                />
              </div>
            );
          })}
        </div>
        <div className="wizard-select__box__galka">
          <img src={selectGalka} />
        </div>
      </div>
      {isOpen && (
        <ul className="wizard-select__list">
          {props.selectOptions.map((option, index) => {
            return (
              <li
                key={index}
                className="wizard-select__list__item"
                onClick={(e) => {
                  handleOptionClick(e, index);
                }}
              >
                {option.title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export const WizardUploadImageField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardUploadImageFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardUploadImageFieldInput = (props: IWizardInputProps) => {
  const [fileName, setFileName] = useState("");
  const [isFileUploading, setIsFileUploading] = useState(false);
  const formData = useStoreState(
    (state) => state.components.createTaskWizard.formData
  );
  const setFormData = useStoreActions(
    (actions) => actions.components.createTaskWizard.setFormData
  );
  const fieldDescription =
    "Перетащите файлы в выделенную область для загрузки или кликните на кнопку “Загрузить”";

  useEffect(() => {
    let val = _.get(formData, props.name, null);
    if (!val) {
      return;
    }

    setFileName(_.get(val, "fileName", ""));
  }, [formData]);

  function handleFileChange(e) {
    let fullPath = e.target.value;
    let fileName = fullPath.replace(/^.*[\\\/]/, "");
    setFileName(fileName);

    setIsFileUploading(true);

    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);

    let action = "upload-file";
    fetch(utils.getAjaxUrl(action), {
      method: "post",
      body: formData,
    })
      .then((res) => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "error") {
            return utils.showAjaxError({ message: "Ошибка!" });
          }

          let fd = { ...formData };
          _.set(fd, props.name + ".value", result.file_id);
          _.set(fd, props.name + ".fileName", fileName);
          setFormData({ ...fd });

          setIsFileUploading(false);
        },
        (error) => {
          utils.showAjaxError({ action, error });
        }
      );
  }

  function handleRemoveItemClick(e) {
    e.stopPropagation();
  }

  return (
    <div className="wizard-upload">
      <input type="file" onChange={handleFileChange} title="" />
      <div className="wizard-upload__inner">
        <div className="wizard-upload__box">
          <img src={cloudUpload} />
          {isFileUploading && (
            <div className="wizard-upload__spinner">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          {!isFileUploading && (
            <div className="wizard-upload__title">
              {fileName ? fileName : fieldDescription}
            </div>
          )}
          {!isFileUploading && (
            <a href="#" className="wizard-upload__btn">
              Загрузить
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const WizardRating = (props: IWizardInputProps): ReactElement => {
  const formData = useStoreState(
    (state) => state.components.completeTaskWizard.formData
  );
  const [rating, setRating] = useState<number>(null);
  const setFormData = useStoreActions(
    (actions) => actions.components.completeTaskWizard.setFormData
  );

  useEffect(() => {
    setFormData({ ...formData, ...{ [props.name]: rating } });
  }, [rating]);

  return (
    <div className="wizard-rating">
      {[1, 2, 3, 4, 5].map((i) => {
        return (
          <div
            key={`RatingStar-${i}`}
            className={`wizard-rating__star ${
              i <= rating ? "wizard-rating__star_active" : ""
            }`}
            onClick={() => setRating(i)}
          />
        );
      })}
    </div>
  );
};
