import { ReactElement, useState, useEffect, useRef } from "react";
import { useStoreState } from "../../model/helpers/hooks";

import logo from "../../assets/img/pic-logo-itv.svg";

const WizardScreen = ({ children, ...props }): ReactElement => {

  return (
    <main className="wizard">
      <div className="wizard__container wizard__ornament">

        <header>
          <img src={logo} className="wizard__logo" alt="IT-волонтер" />
        </header>

        <div className="wizard__content">
          {children}
        </div>

      </div>
    </main>
  );

};


export const WizardScreenBottomBar = (props) => {

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
          <span>{props.title}</span>
        </div>
        <div>
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
        <WizardFormTitle {...props} />
        {children}
        <WizardFormActionBar {...props} />
      </div>
  )
}


export const WizardFormActionBar = ({
  onNexClick,
  onPrevClick,
  goNextStep,
  goPrevStep,  
  isAllowPrevButton,
  ...props
}) => {

  const handleNextClick = (e) => {
    e.preventDefault()

    let isMayGoNextStep = onNexClick ? onNexClick(props) : true;
    if(isMayGoNextStep) {
      goNextStep();
    }    
  }

  const handlePrevClick = (e) => {
    e.preventDefault();

    let isMayGoPrevStep = onPrevClick ? onPrevClick(props) : true;
    if(isMayGoPrevStep) {
      goPrevStep();
    }
  }

  return (
    <div className="wizard-form-action-bar">
      <a href="#" onClick={handleNextClick} className="wizard-form-action-bar__primary-button">Продолжить</a>
      {!!isAllowPrevButton &&
      <a href="#" onClick={handlePrevClick} className="wizard-form-action-bar__secondary-button">{props.step ? "Вернуться" : "Отмена"}</a>
      }
    </div>
  )
}


export const WizardFormTitle = ({
  visibleStep,
  title,
  isRequired,
  ...props
}) => {
  return (
    <h1>
      <span>{visibleStep} →</span>
      {title}
      {isRequired &&
      <span className="wizard-form__required-star">*</span>
      }
    </h1>
  )
}


export const WizardLimitedTextFieldWithHelp = ({
  children,
  formHelpComponent,
  maxLength,
  ...props
}) => {
  return (
    <div className="wizard-field">
      {children}
      <div className="wizard-field__limit-help">
        {!!formHelpComponent &&
          formHelpComponent
        }
        {!formHelpComponent &&
          <div />
        }
        <div className="wizard-field__limit">{`1/${maxLength}`}</div>
      </div>
    </div>
  )
}


export const WizardStringField = ({
  placeholder,
  ...props
}) => {

  return (
    <WizardLimitedTextFieldWithHelp {...props}>
      <input type="text" placeholder={placeholder} />
    </WizardLimitedTextFieldWithHelp>
  )
}


export const WizardTextField = ({
  placeholder,
  ...props
}) => {
  return (
    <WizardLimitedTextFieldWithHelp {...props}>
      <textarea placeholder={placeholder}></textarea>
    </WizardLimitedTextFieldWithHelp>
  )
}



export default WizardScreen;
