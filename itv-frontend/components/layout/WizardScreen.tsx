import { Children, ReactElement, useState, useEffect, useRef } from "react";
import * as _ from "lodash";

import {
  IWizardScreenProps,
  IWizardInputProps,
  IFetchResult,
} from "../../model/model.typing";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import WithGlobalScripts from "../hoc/withGlobalScripts";
import FooterScripts from "./partials/FooterScripts";
import TaskAdminSupport from "../../components/task/TaskAdminSupport";
import * as utils from "../../utilities/utilities";

import logo from "../../assets/img/pic-logo-itv.svg";
import closeModalIcon from "../../assets/img/icon-wizard-modal-close.svg";
import radioCheckOn from "../../assets/img/icon-wizard-radio-on.svg";
import radioCheckOff from "../../assets/img/icon-wizard-radio-off.svg";
import selectGalka from "../../assets/img/icon-wizard-select-galka.svg";
import selectItemRemove from "../../assets/img/icon-select-item-remove.svg";
import cloudUpload from "../../assets/img/icon-wizard-cloud-upload.svg";
import removeFile from "../../assets/img/icon-wizard-remove-file.svg";

export const WizardScreen = ({ children, ...props }): ReactElement => {
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);
  const login = useStoreActions((actions) => actions.session.login);
  const showScreenHelpModalState = useStoreState(
    (state) => state.components.createTaskWizard.showScreenHelpModalState
  );

  const defaultProps = {
    isShowHeader: true,
    modifierClassNames: [],
  };
  props = { ...defaultProps, ...props };

  useEffect(() => {
    console.log("run login in wizard...");

    if (!process.browser) {
      return;
    }

    if (isLoggedIn) {
      return;
    }

    login({ username: "", password: "" });
  }, []);

  return (
    <WithGlobalScripts>
      <main
        className={`wizard ${
          props.screenName === "AgreementScreen" ? "" : "wizard_ornament"
        } ${props.modifierClassNames.join(" ")}`}
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
      <FooterScripts />
    </WithGlobalScripts>
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
          {props.icon && props.title && <img src={props.icon} alt="icon" />}
          {props.title && <span>{props.title}</span>}
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

export const WizardSteps = ({ ...props }) => {
  if(!props.steps || !props.steps.length) {
    return null
  }

  return (
    <div className="wizard-steps">
      {props.steps.map((step, index) => {
        return (
        <div className={`step-list-item ${step.step === props.step ? "active" : step.step < props.step ? "past" : "future"}`}>{step.shortTitle}</div>
        )
      })}
    </div>
  );
};

export const WizardForm = ({ children, ...props }) => {
  const [formFieldNameList, setFormFieldNameList] = useState(null);

  useEffect(() => {
    if (formFieldNameList !== null) {
      return;
    }

    let nameList = [];
    {
      Children.map(children, (child, index) => {
        nameList.push(child.props.name);
      });
    }
    setFormFieldNameList([...nameList]);
  }, [formFieldNameList]);

  return (
    <div className="wizard-form">
      <WizardFormTitle {...(props as IWizardScreenProps)} />
      {children}
      <WizardFormActionBar
        {...(props as IWizardScreenProps)}
        formFieldNameList={formFieldNameList ? formFieldNameList : []}
      />
    </div>
  );
};

export const WizardFormActionBar = (props: IWizardScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleNextClick = (e) => {
    e.preventDefault();

    let isMayGoNextStep = isFieldValid();
    if (isMayGoNextStep) {
      isMayGoNextStep = props.onNextClick ? props.onNextClick(props) : true;
    }

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

    let isMayGoPrevStep = props.onPrevClick ? props.onPrevClick(props) : true;
    if (isMayGoPrevStep) {
      props.goPrevStep();
    }
  };

  function isFieldValid() {
    // console.log("props:", props)

    if (!props.isRequired) {
      return true;
    }

    // console.log("props.formFieldNameList:", props.formFieldNameList)

    let isValid = props.formFieldNameList.reduce((accum, fieldName) => {
      let fieldValue = _.get(props.formData, fieldName + ".value", "");
      if (!fieldValue) {
        fieldValue = _.get(props.formData, fieldName, "");
      }

      // console.log("!!fieldValue:", !!fieldValue)

      return accum && !!fieldValue;
    }, true);

    // console.log("isValid:", isValid)

    return isValid;
  }

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
          className={`wizard-form-action-bar__primary-button btn btn_primary ${
            isFieldValid() ? "" : " btn_disabled"
          }`}
        >
          Продолжить
        </a>
      )}
      {!isLoading && !!props.isAllowPrevButton && (
        <a
          href="#"
          onClick={
            props.visibleStep > 1 ? handlePrevClick : props.onWizardCancel
          }
          className="btn btn_link"
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
  // console.log("props:", props)
  const setShowScreenHelpModalState = useStoreActions(
    (actions) => actions.components.createTaskWizard.setShowScreenHelpModalState
  );
  const helpPageRequest = useStoreActions(
    (actions) => actions.components.helpPage.helpPageRequest
  );
  const helpPageState = useStoreState((state) => state.components.helpPage);
  const helpPageSlug = useStoreState(
    (state) => state.components.createTaskWizard.helpPageSlug
  );

  useEffect(() => {
    // console.log("try load helpPage:", helpPageSlug)
    // console.log("helpPageState:", helpPageState)

    if (!helpPageSlug) {
      return;
    }

    if (helpPageState.slug === helpPageSlug) {
      return;
    }

    // console.log("load helpPage...")
    helpPageRequest(helpPageSlug);
  }, [helpPageState, helpPageSlug]);

  function handleCloseClick(e) {
    e.preventDefault();
    setShowScreenHelpModalState({ [props.screenName]: false });
  }

  // console.log("[WizardHelpModal] props.screenName:", props.screenName)

  return (
    <div className="wizard-help-modal">
      <header>
        <div className="wizard-help-modal__path-wrapper">
          <ul className="wizard-help-modal__path">
            <li>
              <a href="/sovety-dlya-nko-uspeshnye-zadachi/" target="_blank">
                Справочный центр
              </a>
            </li>

            {!!helpPageState.helpCategories && (
              <li>{_.get(helpPageState.helpCategories, "nodes.0.name", "")}</li>
            )}

            {!!helpPageState.id && <li>{helpPageState.title}</li>}
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
      {!helpPageState.id && (
        <div className="spinner-border" role="status"></div>
      )}
      {!!helpPageState.id && (
        <div className="wizard-help-modal-article">
          <div className="wizard-help-modal-article__content">
            <article
              dangerouslySetInnerHTML={{ __html: helpPageState.content }}
            />
          </div>
          <div className="wizard-help-modal-article__content-overlay"></div>
        </div>
      )}
      <footer>
        <TaskAdminSupport buttonTitle="Всё ещё нужна помощь? Напишите администратору" />
      </footer>
    </div>
  );
};

export const WizardLimitedTextFieldWithHelp = ({ field: Field, ...props }) => {
  const inputUseRef = useRef(null);
  const fieldValue = _.get(props.formData, props.name, "");
  const [inputTextLength, setInputTextLength] = useState(
    fieldValue ? fieldValue.length : 0
  );

  function handleInput(e) {
    setInputTextLength(e.target.value.length);

    if (!!props.setFormData) {
      props.setFormData({ [props.name]: e.target.value });
    }
  }

  // console.log("[WizardLimitedTextFieldWithHelp] props:", props)

  return (
    <div className="wizard-field">
      <Field
        {...props}
        name={props.name}
        placeholder={props.placeholder}
        handleInput={handleInput}
        inputUseRef={inputUseRef}
        value={fieldValue}
        selectOptions={props.selectOptions}
        customOptions={props.customOptions}
        isMultiple={props.isMultiple}
        maxLength={props.maxLength}
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
      maxLength={props.maxLength}
      placeholder={props.placeholder}
      onKeyUp={props.handleInput}
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
      maxLength={props.maxLength}
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
    _.set(formData, props.name, String(value));
    setFormData(formData);
  }

  // console.log("formData:", formData)

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
                  _.get(formData, props.name, "") === String(option.value)
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

  function getSelectedOption() {
    let value = _.get(formData, props.name + ".value", null);
    let index = props.selectOptions.findIndex(
      (item) => String(item.value) === String(value)
    );
    return index > -1 ? props.selectOptions[index] : null;
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
  const [filterPhrase, setFilterPhrase] = useState<string>("");
  const [tagCount, setTagCount] = useState<number>(
    (Array.isArray(formData[props.name]?.value) &&
      formData[props.name].value.length) ||
      0
  );

  function handleOptionClick(optionValue: number) {
    let selectedValueList =
      (Array.isArray(formData[props.name]?.value) &&
        formData[props.name].value) ||
      [];

    selectedValueList = Array.from(
      new Set([...selectedValueList, optionValue])
    );

    if (selectedValueList.length >= 3) {
      setFilterPhrase("");
    }

    setTagCount(selectedValueList.length);

    setIsOpen(false);

    setFormData({
      ...formData,
      ...{ [props.name]: { value: selectedValueList } },
    });
  }

  function handleRemoveItemClick(event: React.MouseEvent<HTMLImageElement>) {
    event.stopPropagation();

    const value = Number(event.currentTarget.dataset.value);

    let selectedValueList =
      (Array.isArray(formData[props.name]?.value) &&
        formData[props.name].value) ||
      [];

    selectedValueList = selectedValueList.filter(
      (item: number) => item !== value
    );

    setFormData({
      ...formData,
      ...{ [props.name]: { value: selectedValueList } },
    });

    setTagCount(selectedValueList.length);
  }

  function handleBoxClick() {
    setIsOpen(true);
  }

  function getSelectedOptions() {
    let selectedValueList =
      (Array.isArray(formData[props.name]?.value) &&
        formData[props.name].value) ||
      [];

    return props.selectOptions.filter(
      (item) =>
        selectedValueList.findIndex((value: number) => item.value === value) >
        -1
    );
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterPhrase(event.currentTarget.value);
    handleBoxClick();
  }

  return (
    <div className="wizard-select wizard-select_multiple">
      {getSelectedOptions().length > 0 && (
        <div className="wizard-select__box wizard-select__box_multiple">
          <div className="wizard-select__box__selected-set wizard-select__box__selected-set_multiple">
            {getSelectedOptions().map((option) => {
              return (
                <div
                  key={`Tag-${option.value}`}
                  className="wizard-select__box__selected-item"
                >
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
        </div>
      )}
      <div className="wizard-smart-search">
        <input
          className="form__control form__control_input form__control_full-width"
          type="search"
          value={filterPhrase}
          onChange={onInputChange}
          disabled={tagCount >= 3}
        />
        {filterPhrase && isOpen && (
          <ul className="wizard-select__list">
            {props.selectOptions
              .filter((option) => {
                if (filterPhrase) {
                  if (
                    option.title.search(new RegExp(`^${filterPhrase}`, "i")) ===
                    -1
                  ) {
                    return false;
                  }
                }

                return true;
              })
              .map((option) => {
                return (
                  <li
                    key={`Tag-${option.value}`}
                    className="wizard-select__list__item"
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {option.title}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
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
  const [files, setFiles] = useState([]);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const formData = useStoreState(
    (state) => state.components.createTaskWizard.formData
  );
  const setFormData = useStoreActions(
    (actions) => actions.components.createTaskWizard.setFormData
  );
  const fieldDescription = _.get(
    props,
    "description",
    "Перетащите файлы в выделенную область для загрузки или кликните на кнопку “Загрузить”"
  );
  const acceptFileFormat = _.get(props, "acceptFileFormat", "");

  useEffect(() => {
    let val = _.get(formData, props.name, null);
    if (!val) {
      return;
    }

    setFiles(val);
  }, [formData]);

  function handleFileChange(e) {
    let fullPath = e.target.value;
    let fileName = fullPath.replace(/^.*[\\\/]/, "");

    setIsFileUploading(true);

    const form = new FormData();
    for (let fi = 0; fi < e.target.files.length; fi++) {
      form.append("file_" + fi, e.target.files[fi], e.target.files[fi].name);
    }

    let action = "upload-file";
    fetch(utils.getAjaxUrl(action), {
      method: "post",
      body: form,
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
            setIsFileUploading(false);
            return utils.showAjaxError({ message: "Ошибка!" });
          }

          let fd = { ...formData };

          let fileFormValue = props.isMultiple ? _.get(fd, props.name, []) : [];

          for (let fi in result.files) {
            fileFormValue.push({
              value: result.files[fi].file_id,
              fileName: result.files[fi].file_url.replace(/^.*[\\\/]/, ""),
            });
          }
          _.set(fd, props.name, fileFormValue);
          setFormData({ ...fd });

          setIsFileUploading(false);
        },
        (error) => {
          utils.showAjaxError({ action, error });
        }
      );
  }

  function handleRemoveFileClick(e) {
    e.stopPropagation();

    let value = parseInt(e.target.dataset.value);
    let fd = { ...formData };
    _.set(
      fd,
      props.name,
      _.get(fd, props.name, []).filter((item) => item.value !== value)
    );
    setFormData({ ...fd });
  }

  return (
    <div className="wizard-upload">
      <input
        type="file"
        onChange={handleFileChange}
        title=""
        multiple={!!props.isMultiple}
        accept={acceptFileFormat}
      />
      <div className="wizard-upload__inner">
        <div className="wizard-upload__box">
          {!isFileUploading && !files.length && <img src={cloudUpload} />}

          {isFileUploading && (
            <div className="wizard-upload__spinner">
              <div className="spinner-border" role="status"></div>
            </div>
          )}

          {!isFileUploading && !!files.length && (
            <div className="wizard-upload__files">
              {files.map(({ fileName, value }, key) => {
                return (
                  <div className="wizard-upload__file" key={key}>
                    <span>{fileName}</span>
                    <img
                      src={removeFile}
                      className="wizard-upload__remove-file"
                      onClick={handleRemoveFileClick}
                      data-value={value}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {!isFileUploading && !files.length && (
            <div className="wizard-upload__title">{fieldDescription}</div>
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
  const [rating, setRating] = useState<number>(formData[props.name] ?? null);
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
