import { ReactElement, useState, useEffect, useRef } from "react";
import { useStoreState } from "../../model/helpers/hooks";

import OrnamentImage from "../../assets/img/bg-modal-ornament.svg";
import Logo from "../../assets/img/pic-logo-itv.svg";

const WizardScreen: React.FunctionComponent<{
  goNextStep,
  goPrevStep,
}> = ({ children, ...props }): ReactElement => {

  return (
    <main className="wizard">
      <div className="wizard__container wizard__ornament">

        <header>
          <img src={Logo} className="wizard__logo" alt="IT-волонтер" />
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
  )
}

export default WizardScreen;
