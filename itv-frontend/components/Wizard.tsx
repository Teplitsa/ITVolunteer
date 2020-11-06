import { Children, cloneElement, useState, useEffect, ReactElement } from "react";
import { IWizardScreenProps } from "../model/model.typing";

const Wizard: React.FunctionComponent<any> = ({
  children,
  saveWizardData,
  step,
  setStep,
  ...props
}): ReactElement => {
  const [ignoredStepNumbers, setIgnoredStepNumbers] = useState([]);
  const [visibleStep, setVisibleStep] = useState(1);
  const [visibleStepsCount, setVisibleStepsCount] = useState(1);
  const stepsCount = Children.count(children);

  useEffect(() => {
    let vs = step + 1;
    for (let istep = 0; istep < step; istep++) {
      if (ignoredStepNumbers.findIndex(ignoredStep => ignoredStep === istep) > -1) {
        vs -= 1;
      }
    }
    setVisibleStep(vs);
  }, [step]);

  useEffect(() => {
    setVisibleStepsCount(stepsCount - ignoredStepNumbers.length);
  }, [ignoredStepNumbers]);

  useEffect(() => {
    const localIgnoredStepNumbers: Array<number> = [];

    Children.map(children, (child, index) => {
      if (child.props.isIgnoreStepNumber) {
        localIgnoredStepNumbers.push(index);
      }
    });

    setIgnoredStepNumbers(Array.from(new Set([...ignoredStepNumbers, ...localIgnoredStepNumbers])));
  }, []);

  const screenProps: IWizardScreenProps = {
    step,
    setStep,
    stepsCount: stepsCount,
    onPrevClick: null,
    onNextClick: null,
    formHelpComponent: null,
    isAllowPrevButton: true,
    isIgnoreStepNumber: false,

    steps: Children.map(children, (child, index) => {
      return {
        shortTitle: child.props.shortTitle,
        step: index,
      };
    }),

    goNextStep: () => {
      if (step >= stepsCount - 1) {
        return;
      }
      // console.log("set step:", step + 1)

      setStep(step + 1);

      if (saveWizardData) {
        saveWizardData();
      }
    },

    goPrevStep: () => {
      if (step <= 0) {
        return;
      }
      setStep(step - 1);

      if (saveWizardData) {
        saveWizardData();
      }
    },
  };

  return (
    <>
      {Children.map(children, (child, index) => {
        return step === index
          ? cloneElement(child, {
              ...screenProps,
              ...props,
              visibleStep,
              visibleStepsCount,
            })
          : null;
      })}
    </>
  );
};

export default Wizard;
