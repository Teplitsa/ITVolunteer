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


/*
 *  Fields
 */
export const WizardLimitedTextFieldWithHelp = ({
  field: Field,
  formHelpComponent,
  maxLength,
  placeholder,
  name,
  formData,
  setFormData,
  ...props
}) => {
  const inputUseRef = useRef(null)
  const fieldValue = _.get(formData, name, "")
  const [inputTextLength, setInputTextLength] = useState(fieldValue.length)

  function handleInput(e) {
    setInputTextLength(e.target.value.length)

    if(!!setFormData) {
      setFormData({[name]: e.target.value})
    }
  }

  return (
    <div className="wizard-field">
      <Field placeholder={placeholder} handleInput={handleInput} inputUseRef={inputUseRef} value={fieldValue} />
      <div className="wizard-field__limit-help">
        {!!formHelpComponent &&
          formHelpComponent
        }
        {!formHelpComponent &&
          <div />
        }
        {maxLength > 0 &&
        <div className="wizard-field__limit">{`${inputTextLength}/${maxLength}`}</div>
        }
      </div>
    </div>
  )
}


export const WizardStringField = ({
  ...props
}) => {

  return (
    <WizardLimitedTextFieldWithHelp 
      {...props}
      field={WizardStringFieldInput}
    >
    </WizardLimitedTextFieldWithHelp>
  )
}

export const WizardStringFieldInput = ({
  placeholder,
  handleInput,
  inputUseRef,
  value,
}) => {

  return (
    <input type="text" placeholder={placeholder} onKeyDown={handleInput} ref={inputUseRef} defaultValue={value} />
  )
}

export const WizardTextField = ({
  ...props
}) => {
  return (
    <WizardLimitedTextFieldWithHelp {...props}
      field={WizardTextFieldInput}
    >      
    </WizardLimitedTextFieldWithHelp>
  )
}

export const WizardTextFieldInput = ({
  placeholder,
  handleInput,
  inputUseRef,
  value,
  ...props
}) => {
  return (
      <textarea placeholder={placeholder} onKeyUp={handleInput} ref={inputUseRef} defaultValue={value}></textarea>
  )
}

export default WizardScreen;
