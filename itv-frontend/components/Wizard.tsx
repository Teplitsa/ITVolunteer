import { Children, cloneElement, ReactElement, useState, useEffect, useRef } from "react";
import {
  IWizardScreenProps,
} from "../model/model.typing";

const Wizard = ({ children, saveWizardData, step, setStep, ...props }) => {
  const [ignoredStepNumbers, setIgnoredStepNumbers] = useState([])
  const [visibleStep, setVisibleStep] = useState(1)
  const [visibleStepsCount, setVisibleStepsCount] = useState(1)
  const stepsCount = Children.count(children)

  useEffect(() => {
    let vs = step + 1
    for(let istep = 0; istep < step; istep++) {
      if(ignoredStepNumbers.findIndex((ignoredStep) => ignoredStep === istep) > -1) {
        vs -= 1
      }
    }    
    setVisibleStep(vs)
  }, [step]);

  useEffect(() => {
    setVisibleStepsCount(stepsCount - ignoredStepNumbers.length)
  }, [ignoredStepNumbers])

  const screenProps: IWizardScreenProps = {
    step,
    setStep,
    stepsCount: stepsCount,
    onPrevClick: null,
    onNextClick: null,
    formHelpComponent: null,
    isAllowPrevButton: true,
    isIgnoreStepNumber: false,
    visibleStep: visibleStep,
    visibleStepsCount: visibleStepsCount,

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
    <>
      {Children.map(children, (child, index) => {
        // console.log("child index:", index)
        // console.log("child step:", step)
        // console.log("child.props.isIgnoreStepNumber:", child.props.isIgnoreStepNumber)

        if(child.props.isIgnoreStepNumber && ignoredStepNumbers.findIndex((ignoredStep) => ignoredStep === index) === -1) {
          setIgnoredStepNumbers([...ignoredStepNumbers, ...[index]])
        }

        return step === index ? cloneElement(child, {...screenProps, ...props}) : null
      })}
    </>
  );

};

export default Wizard;
