import { ReactElement, useState, useEffect, useRef } from "react";
import { useStoreState } from "../../model/helpers/hooks";

import logo from "../../assets/img/pic-logo-itv.svg";
import howToIcon from "../../assets/img/icon-question-green.svg";

const WizardScreen: React.FunctionComponent<{
  goNextStep,
  goPrevStep,
}> = ({ children, ...props }): ReactElement => {

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

export const WizardLimitedTextField = ({children, ...props}) => {
  return (
    <div className="wizard-field">
      {children}
      <div className="wizard-field__limit-help">
        <div className="wizard-field__help">
          <img src={howToIcon} className="wizard-field__icon" />
          {props.howtoTitle}
        </div>
        <div className="wizard-field__limit">{`1/${props.maxLength}`}</div>
      </div>
    </div>
  )
}


export const WizardStringField = (props) => {
  return (
    <WizardLimitedTextField {...props}>
      <input type="text" placeholder={props.placeholder} />
    </WizardLimitedTextField>
  )
}


export const WizardTextField = (props) => {
  return (
    <WizardLimitedTextField {...props}>
      <textarea placeholder={props.placeholder}></textarea>
    </WizardLimitedTextField>
  )
}



export default WizardScreen;
