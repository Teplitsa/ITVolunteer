import { Children, cloneElement, ReactElement, useState, useEffect, useRef } from "react";

const Wizard = ({ component: Component, children, saveWizardData, step, setStep, formData, setFormData, ...props }) => {
  const [ignoredStepNumbers, setIgnoredStepNumbers] = useState([])
  const [visibleStep, setVisibleStep] = useState(1)
  const stepsCount = Children.count(children)

  useEffect(() => {
    let vs = step + 1
    for(let istep = 0; istep < step; istep++) {
      if(ignoredStepNumbers.findIndex((ignoredStep) => ignoredStep === istep) > -1) {
        vs -= 1
      }
    }    
    console.log("vs:", vs)
    setVisibleStep(vs)
  }, [step]);

  const screenProps = {
    step,
    setStep,
    stepsCount: stepsCount,
    onPrevClick: null,
    onNextClick: null,
    formHelpComponent: null,
    isAllowPrevButton: true,
    isIgnoreStepNumber: false,
    visibleStep: null,

    goNextStep: () => {
      if(step >= stepsCount - 1) {
        return
      }
      console.log("set step:", step + 1)

      setStep(step + 1)

      if(saveWizardData) {
        saveWizardData()
      }
    },

    goPrevStep: () => {
      if(step <= 0) {
        return
      }
      setStep(step - 1)

      if(saveWizardData) {
        saveWizardData()
      }
    },
  }

  return (
    <Component {...screenProps} {...props} visibleStep={visibleStep}>
      {Children.map(children, (child, index) => {
        // console.log("child index:", index)
        // console.log("child step:", step)
        // console.log("child.props.isIgnoreStepNumber:", child.props.isIgnoreStepNumber)

        if(child.props.isIgnoreStepNumber && ignoredStepNumbers.findIndex((ignoredStep) => ignoredStep === index) === -1) {
          setIgnoredStepNumbers([...ignoredStepNumbers, ...[index]])
        }

        return step === index ? cloneElement(child, {...screenProps, ...props, visibleStep}) : null
      })}
    </Component>
  );

};

export default Wizard;
