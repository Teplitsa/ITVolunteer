import { ReactElement, useState, useEffect, useRef } from "react";
import * as _ from "lodash"

import {
  IWizardScreenProps,
  IWizardInputProps,
} from "../../model/model.typing";
import { useStoreState } from "../../model/helpers/hooks";

import logo from "../../assets/img/pic-logo-itv.svg";

export const WizardScreen = ({ children, ...props }): ReactElement => {
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
          <div className="wizard-progressbar__fraction">{`${props.step + 1}/${props.stepsCount}`}</div>
          <div className="wizard-progressbar__total">
            <div className="wizard-progressbar__complete" style={{
              width: `${100 * (props.step + 1) / props.stepsCount}%`,
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
    console.log("handleNextClick...")

    e.preventDefault()

    let isMayGoNextStep = props.onNextClick ? props.onNextClick(props) : true;
    console.log("isMayGoNextStep:", isMayGoNextStep)

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
      <Field placeholder={props.placeholder} handleInput={handleInput} inputUseRef={inputUseRef} value={fieldValue} />
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
