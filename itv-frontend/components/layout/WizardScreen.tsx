import { Children, ReactElement, useState, useEffect, useRef } from "react";
import * as _ from "lodash";

import { IWizardScreenProps, IWizardInputProps, IFetchResult } from "../../model/model.typing";
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

export const WizardScreen: React.FunctionComponent<
  { modifierClassNames?: Array<any> } & IWizardScreenProps
> = ({ children, ...props }): ReactElement => {
  const showScreenHelpModalState = useStoreState(
    state => state.components.createTaskWizard.showScreenHelpModalState
  );

  const defaultProps = {
    isShowHeader: true,
    modifierClassNames: [],
  };
  props = { ...defaultProps, ...props };

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

export const WizardScreenBottomBar: React.FunctionComponent<IWizardScreenProps> = props => {
  // function handleNextClick(e) {
  //   e.preventDefault();
  //   props.goNextStep();
  // }

  // function handlePrevClick(e) {
  //   e.preventDefault();
  //   props.goPrevStep();
  // }

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
                width: `${(100 * props.visibleStep) / props.visibleStepsCount}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WizardSteps: React.FunctionComponent<{
  steps?: Array<{ step: number; shortTitle: string }>;
  step?: number;
}> = props => {
  if (!props.steps || !props.steps.length) {
    return null;
  }

  return (
    <div className="wizard-steps">
      {props.steps.map((step, i) => {
        return (
          <div
            key={i}
            className={`step-list-item ${
              step.step === props.step ? "active" : step.step < props.step ? "past" : "future"
            }`}
          >
            {step.shortTitle}
          </div>
        );
      })}
    </div>
  );
};

export const WizardForm: React.FunctionComponent<IWizardScreenProps> = ({ children, ...props }) => {
  const [formFieldNameList, setFormFieldNameList] = useState(null);

  useEffect(() => {
    if (formFieldNameList !== null) {
      return;
    }

    const nameList = [];
    {
      Children.map(children, (child: any) => {
        nameList.push(child.props.name);
      });
    }
    setFormFieldNameList([...nameList]);
  }, [formFieldNameList]);

  return (
    <div className="wizard-form">
      <WizardFormTitle {...props} />
      {children}
      <WizardFormActionBar
        {...props}
        formFieldNameList={formFieldNameList ? formFieldNameList : []}
      />
    </div>
  );
};

export const WizardFormActionBar: React.FunctionComponent<IWizardScreenProps> = props => {
  const [isLoading, setIsLoading] = useState(false);

  const handleNextClick = e => {
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

  const handlePrevClick = e => {
    e.preventDefault();

    const isMayGoPrevStep = props.onPrevClick ? props.onPrevClick(props) : true;
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

    const isValid = props.formFieldNameList.reduce((accum, fieldName) => {
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
          onClick={props.visibleStep > 1 ? handlePrevClick : props.onWizardCancel}
          className="btn btn_link"
        >
          {props.visibleStep > 1 ? "Вернуться" : "Отмена"}
        </a>
      )}
    </div>
  );
};

export const WizardFormTitle: React.FunctionComponent<IWizardScreenProps> = props => {
  return (
    <h1 className="wizard-form__title">
      <span className="wizard-form__title-index">{props.visibleStep}</span>
      {props.title}
      {props.isRequired && <span className="wizard-form__required-star">*</span>}
    </h1>
  );
};

/*
 *  Fields
 */
export const WizardHelpModal: React.FunctionComponent<IWizardScreenProps> = props => {
  // console.log("props:", props)
  const setShowScreenHelpModalState = useStoreActions(
    actions => actions.components.createTaskWizard.setShowScreenHelpModalState
  );
  const helpPageRequest = useStoreActions(actions => actions.components.helpPage.helpPageRequest);
  const helpPageState = useStoreState(state => state.components.helpPage);
  const helpPageSlug = useStoreState(state => state.components.createTaskWizard.helpPageSlug);

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
        <a href="#" className="wizard-help-modal__close" onClick={handleCloseClick}>
          <img src={closeModalIcon} />
        </a>
      </header>
      {!helpPageState.id && <div className="spinner-border" role="status"></div>}
      {!!helpPageState.id && (
        <div className="wizard-help-modal-article">
          <div className="wizard-help-modal-article__content">
            <article dangerouslySetInnerHTML={{ __html: helpPageState.content }} />
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

export const WizardLimitedTextFieldWithHelp: React.FunctionComponent<
  { field: React.FunctionComponent<any> } & {
    name?: string;
    setFormData?: (args: any) => void;
  } & IWizardScreenProps
> = ({ field: Field, ...props }) => {
  const formFieldPlaceholders = useStoreState(state => state.components.createTaskWizard.formFieldPlaceholders);
  const inputUseRef = useRef(null);
  const fieldValue = _.get(props.formData, props.name, "");
  const [inputTextLength, setInputTextLength] = useState(fieldValue ? fieldValue.length : 0);
  const [inputPlaceholder, setInputPlaceholder] = useState("");

  function handleInput(e) {
    setInputTextLength(e.target.value.length);

    if (props.setFormData) {
      props.setFormData({ [props.name]: e.target.value });
    }
  }

  useEffect(() => {
    if(_.isEmpty(formFieldPlaceholders)) {

      if(props.placeholder) {
        setInputPlaceholder(props.placeholder);
      }
      
      return;
    }
    
    const phList = _.get(formFieldPlaceholders, props.name, [props.placeholder]);
    if(phList.length > 0) {
      const randomIndex = Math.floor(Math.random() * phList.length);
      setInputPlaceholder(phList[randomIndex]);
    }
  }, [formFieldPlaceholders]);

  // console.log("[WizardLimitedTextFieldWithHelp] props:", props)

  return (
    <div className="wizard-field">
      <Field
        {...props}
        name={props.name}
        placeholder={inputPlaceholder}
        handleInput={handleInput}
        inputUseRef={inputUseRef}
        value={fieldValue}
        selectOptions={props.selectOptions}
        customOptions={props.customOptions}
        isMultiple={props.isMultiple}
        maxLength={props.maxLength}
      />
      {(props.formHelpComponent || props.maxLength > 0) && (
        <div className="wizard-field__limit-help">
          {props.formHelpComponent && <props.formHelpComponent {...props} />}
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
export const WizardStringField: React.FunctionComponent<IWizardScreenProps> = props => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardStringFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardStringFieldInput: React.FunctionComponent<IWizardInputProps> = props => {
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
export const WizardTextField: React.FunctionComponent<IWizardScreenProps> = props => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardTextFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardTextFieldInput: React.FunctionComponent<IWizardInputProps> = props => {
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
export const WizardRadioSetField: React.FunctionComponent<IWizardScreenProps> = props => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardRadioSetFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardRadioSetFieldInput: React.FunctionComponent<IWizardInputProps> = props => {
  const formData = useStoreState(state => state.components.createTaskWizard.formData);
  const setFormData = useStoreActions(actions => actions.components.createTaskWizard.setFormData);

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
            onClick={e => {
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

export const WizardSelectField: React.FunctionComponent<IWizardScreenProps> = props => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardSelectFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardSelectFieldInput: React.FunctionComponent<IWizardScreenProps> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const formData = useStoreState(state => state.components.createTaskWizard.formData);
  const setFormData = useStoreActions(actions => actions.components.createTaskWizard.setFormData);

  function handleOptionClick(e, index) {
    const fd = { ...formData };
    _.set(fd, props.name + ".index", index);
    const selectedOption = props.selectOptions[index];
    _.set(fd, props.name + ".value", String(selectedOption.value));
    setFormData({ ...fd });
    setIsOpen(false);
  }

  function handleBoxClick() {
    setIsOpen(!isOpen);
  }

  function getSelectedOption() {
    const value = _.get(formData, props.name + ".value", null);
    const index = props.selectOptions.findIndex(item => String(item.value) === String(value));
    return index > -1 ? props.selectOptions[index] : null;
  }

  // function getSelectedOptionValue() {
  //   const option = getSelectedOption();
  //   return option ? _.get(option, "value", "") : "";
  // }

  function getSelectedOptionTitle() {
    const option = getSelectedOption();
    return option ? _.get(option, "title", "") : "";
  }

  return (
    <div className="wizard-select">
      <div className="wizard-select__box" onClick={handleBoxClick}>
        <div className="wizard-select__box__title">{getSelectedOptionTitle()}</div>
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
                onClick={e => {
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

export const WizardMultiSelectField: React.FunctionComponent<IWizardScreenProps> = props => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardMultiSelectFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardMultiSelectFieldInput: React.FunctionComponent<IWizardScreenProps> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const formData = useStoreState(state => state.components.createTaskWizard.formData);
  const setFormData = useStoreActions(actions => actions.components.createTaskWizard.setFormData);
  const [filterPhrase, setFilterPhrase] = useState<string>("");
  const [tagCount, setTagCount] = useState<number>(
    (Array.isArray(formData[props.name]?.value) && formData[props.name].value.length) || 0
  );

  function handleOptionClick(optionValue: number) {
    let selectedValueList =
      (Array.isArray(formData[props.name]?.value) && formData[props.name].value) || [];

    selectedValueList = Array.from(new Set([...selectedValueList, optionValue]));

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
      (Array.isArray(formData[props.name]?.value) && formData[props.name].value) || [];

    selectedValueList = selectedValueList.filter((item: number) => Number(item) !== value);

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
    const selectedValueList =
      (Array.isArray(formData[props.name]?.value) && formData[props.name].value) || [];

    return props.selectOptions.filter(
      item =>
        selectedValueList.findIndex((value: number) => Number(item.value) === Number(value)) > -1
    );
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterPhrase(event.currentTarget.value);
    handleBoxClick();
  }

  function blurSmartSearch(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.classList.contains("wizard-select__box-close") &&
      !target.classList.contains("form__control_input") &&
      !target.classList.contains("wizard-select__list__item")
    ) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("click", blurSmartSearch);
    return () => document.removeEventListener("click", blurSmartSearch);
  }, []);

  return (
    <div className="wizard-select wizard-select_multiple">
      {getSelectedOptions().length > 0 && (
        <div className="wizard-select__box wizard-select__box_multiple">
          <div className="wizard-select__box__selected-set wizard-select__box__selected-set_multiple">
            {getSelectedOptions().map(option => {
              return (
                <div key={`Tag-${option.value}`} className="wizard-select__box__selected-item">
                  <span>{option.title}</span>
                  <img
                    className="wizard-select__box-close"
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
          onFocus={() => setIsOpen(true)}
          disabled={tagCount >= 3}
        />
        {isOpen && (
          <ul className="wizard-select__list wizard-select__list_multiple">
            {props.selectOptions
              .filter(option => {
                if (filterPhrase) {
                  if (option.title.search(new RegExp(`${filterPhrase}`, "i")) === -1) {
                    return false;
                  }
                }

                return true;
              })
              .map(option => {
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

export const WizardUploadImageField: React.FunctionComponent<IWizardScreenProps> = props => {
  return (
    <WizardLimitedTextFieldWithHelp
      {...props}
      field={WizardUploadImageFieldInput}
    ></WizardLimitedTextFieldWithHelp>
  );
};

export const WizardUploadImageFieldInput: React.FunctionComponent<IWizardScreenProps> = props => {
  const [files, setFiles] = useState([]);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const formData = props.formData;
  const setFormData = props.setFormData;
  const fieldDescription = _.get(
    props,
    "description",
    "Перетащите файлы в выделенную область для загрузки или кликните на кнопку “Загрузить”"
  );
  const acceptFileFormat = _.get(props, "acceptFileFormat", "");

  useEffect(() => {
    const val = _.get(formData, props.name, null);
    if (!val) {
      return;
    }

    setFiles(val);
  }, [formData]);

  function handleFileChange(e) {
    // const fullPath = e.target.value;
    // const fileName = fullPath.replace(/^.*\//, "");

    setIsFileUploading(true);

    const form = new FormData();
    for (let fi = 0; fi < e.target.files.length; fi++) {
      form.append("file_" + fi, e.target.files[fi], e.target.files[fi].name);
    }

    const action = "upload-file";
    utils.tokenFetch(utils.getAjaxUrl(action), {
      method: "post",
      body: form,
    })
      .then(res => {
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

          const fd = { ...formData };

          const fileFormValue = props.isMultiple ? _.get(fd, props.name, []) : [];

          for (const fi in result.files) {
            fileFormValue.push({
              value: result.files[fi].file_id,
              fileName: result.files[fi].file_url.replace(/^.*\//, ""),
            });
          }
          _.set(fd, props.name, fileFormValue);
          setFormData({ ...fd });

          setIsFileUploading(false);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }

  function handleRemoveFileClick(e) {
    e.stopPropagation();

    const value = parseInt(e.target.dataset.value);
    const fd = { ...formData };
    _.set(
      fd,
      props.name,
      _.get(fd, props.name, []).filter(item => item.value !== value)
    );
    setFormData({ ...fd });
  }

  return (
    <div className="wizard-upload">
      <input
        type="file"
        onChange={handleFileChange}
        title=""
        multiple={props.isMultiple}
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
  const formData = useStoreState(state => state.components.completeTaskWizard.formData);
  const [rating, setRating] = useState<number>(formData[props.name] ?? null);
  const setFormData = useStoreActions(actions => actions.components.completeTaskWizard.setFormData);

  useEffect(() => {
    setFormData({ ...formData, ...{ [props.name]: rating } });
  }, [rating]);

  return (
    <div className="wizard-rating">
      {[1, 2, 3, 4, 5].map(i => {
        return (
          <div
            key={`RatingStar-${i}`}
            className={`wizard-rating__star ${i <= rating ? "wizard-rating__star_active" : ""}`}
            onClick={() => setRating(i)}
          />
        );
      })}
    </div>
  );
};
