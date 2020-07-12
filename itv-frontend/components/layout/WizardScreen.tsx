import { ReactElement, useState, useEffect, useRef } from "react";
import * as _ from "lodash"

import {
  IWizardScreenProps,
  IWizardInputProps,
} from "../../model/model.typing";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

import logo from "../../assets/img/pic-logo-itv.svg";
import closeModalIcon from "../../assets/img/icon-wizard-modal-close.svg";
import radioCheckOn from "../../assets/img/icon-wizard-radio-on.svg";
import radioCheckOff from "../../assets/img/icon-wizard-radio-off.svg";

export const WizardScreen = ({ children, ...props }): ReactElement => {
  const showScreenHelpModalState = useStoreState((state) => state.components.createTaskWizard.showScreenHelpModalState)

  const defaultProps = {
    isShowHeader: true,
  }
  props = {...defaultProps, ...props}

  return (
    <main className="wizard">
      <div className="wizard__container wizard__ornament">

        {props.isShowHeader &&
        <header>
          <img src={logo} className="wizard__logo" alt="IT-волонтер" />
        </header>
        }

        <div className="wizard__content">
          {children}
        </div>

        {_.get(showScreenHelpModalState, props.screenName, false) &&
          <WizardHelpModal {...props} />
        }

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
          {!!props.icon && 
            <img src={props.icon} alt="icon" />
          }        
          {!!props.title &&
          <span>{props.title}</span>
          }
        </div>
        <div>
          #DEBUG#
          <br />
          <a href="#" onClick={handleNextClick}>Далее</a>
          <br />
          <a href="#" onClick={handlePrevClick}>Назад</a>
        </div>
        <div className="wizard-progressbar">
          <div className="wizard-progressbar__fraction">{`${props.visibleStep}/${props.visibleStepsCount}`}</div>
          <div className="wizard-progressbar__total">
            <div className="wizard-progressbar__complete" style={{
              width: `${100 * props.visibleStep / props.visibleStepsCount}%`,
            }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}


export const WizardForm = ({children, ...props}) => {
  return (
      <div className="wizard-form">
        <WizardFormTitle {...props as IWizardScreenProps} />
        {children}
        <WizardFormActionBar {...props as IWizardScreenProps} />
      </div>
  )
}


export const WizardFormActionBar = (props: IWizardScreenProps) => {

  const handleNextClick = (e) => {

    e.preventDefault()

    let isMayGoNextStep = props.onNextClick ? props.onNextClick(props) : true;

    if(isMayGoNextStep) {
      props.goNextStep();
    }    
  }

  const handlePrevClick = (e) => {
    e.preventDefault();

    let isMayGoPrevStep = props.onPrevClick ? props.onPrevClick(props) : true;
    if(isMayGoPrevStep) {
      props.goPrevStep();
    }
  }

  return (
    <div className="wizard-form-action-bar">
      <a href="#" onClick={handleNextClick} className="wizard-form-action-bar__primary-button">Продолжить</a>
      {!!props.isAllowPrevButton &&
      <a href="#" onClick={handlePrevClick} className="wizard-form-action-bar__secondary-button">{props.step ? "Вернуться" : "Отмена"}</a>
      }
    </div>
  )
}


export const WizardFormTitle = (props: IWizardScreenProps) => {
  return (
    <h1>
      <span>{props.visibleStep} →</span>
      {props.title}
      {props.isRequired &&
      <span className="wizard-form__required-star">*</span>
      }
    </h1>
  )
}


/*
 *  Fields
 */
 export const WizardHelpModal = (props: IWizardScreenProps) => {
   const setShowScreenHelpModalState = useStoreActions((actions) => actions.components.createTaskWizard.setShowScreenHelpModalState)

   function handleCloseClick(e) {
     e.preventDefault();
     setShowScreenHelpModalState({[props.screenName]: false});
   }

  console.log("props.screenName:", props.screenName)

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
         <a href="#" className="wizard-help-modal__close" onClick={handleCloseClick}>
           <img src={closeModalIcon} />
         </a>
       </header>
       <div className="wizard-help-modal-article">
         <div className="wizard-help-modal-article__content">
           <article>
             <h1>Как правильно дать название задачи?</h1>
             <p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
             <p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
             <p>В хорошем заголовке должны быть указана желаемая технология, например:</p>
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
             <p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
             <p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
             <p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
             <p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
             <p>Хороший заголовок содержит в себе краткое и точное описание задачи, с учетом её специфики.</p>
             <p>Например: «сделать сайт благотворительной организации» — плохой заголовок. «Настроить сайт на WP для поиска пропавших граждан РФ» — лучше.</p>
           </article>
         </div>
         <div className="wizard-help-modal-article__content-overlay"></div>
       </div>
       <footer>
          <a
            href="#"
            className="contact-admin"
          >
            Всё ещё нужна помощь? Напишите администратору
          </a>
       </footer>
     </div>
   )
}


export const WizardLimitedTextFieldWithHelp = ({field: Field, ...props}) => {
  const inputUseRef = useRef(null)
  const fieldValue = _.get(props.formData, props.name, "")
  const [inputTextLength, setInputTextLength] = useState(fieldValue.length)

  function handleInput(e) {
    setInputTextLength(e.target.value.length)

    if(!!props.setFormData) {
      props.setFormData({[props.name]: e.target.value})
    }
  }

  return (
    <div className="wizard-field">
      <Field placeholder={props.placeholder} handleInput={handleInput} inputUseRef={inputUseRef} value={fieldValue} selectOptions={props.selectOptions} />
      <div className="wizard-field__limit-help">
        {!!props.formHelpComponent &&
          props.formHelpComponent
        }
        {!props.formHelpComponent &&
          <div />
        }
        {props.maxLength > 0 &&
        <div className="wizard-field__limit">{`${inputTextLength}/${props.maxLength}`}</div>
        }
      </div>
    </div>
  )
}


export const WizardStringField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp 
      {...props}
      field={WizardStringFieldInput}
    >
    </WizardLimitedTextFieldWithHelp>
  )
}

export const WizardStringFieldInput = (props: IWizardInputProps) => {
  return (
    <input type="text" placeholder={props.placeholder} onKeyDown={props.handleInput} ref={props.inputUseRef} defaultValue={props.value} />
  )
}

export const WizardTextField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp {...props}
      field={WizardTextFieldInput}
    >      
    </WizardLimitedTextFieldWithHelp>
  )
}

export const WizardTextFieldInput = (props: IWizardInputProps) => {
  return (
      <textarea placeholder={props.placeholder} onKeyUp={props.handleInput} ref={props.inputUseRef} defaultValue={props.value}></textarea>
  )
}

export const WizardRadioSetField = (props: IWizardScreenProps) => {
  return (
    <WizardLimitedTextFieldWithHelp {...props}
      field={WizardRadioSetFieldInput}
    >      
    </WizardLimitedTextFieldWithHelp>
  )
}

export const WizardRadioSetFieldInput = (props: IWizardInputProps) => {
  const formData = useStoreState((state) => state.components.createTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.createTaskWizard.setFormData)

  function handleOptionClick(e, value) {
    _.set(formData, props.name + ".value", String(value))
    setFormData(formData)
  }

  return (
    <div>
      {props.selectOptions.map((option) => {
        return (
          <div className="wizard-radio-option">
            <div className="wizard-radio-option__check" onClick={(e) => {handleOptionClick(e, option.value)}}>
              <img src={_.get(formData, props.name + ".value", "") === String(option.value) ? radioCheckOn : radioCheckOff} />
            </div>
            <span className="wizard-radio-option__title">{option.title}</span>
          </div>
        )
      })}
    </div>
  )
}
