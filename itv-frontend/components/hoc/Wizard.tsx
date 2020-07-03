import { Children, cloneElement, ReactElement, useState, useEffect, useRef } from "react";

const Wizard = ({ component: Component, children, ...props }) => {
  const [step, setStep] = useState(0)
  const stepsCount = Children.count(children)

  useEffect(() => {
  }, []);

  const screenProps = {
    step,
    setStep,
    stepsCount: stepsCount,
    goNextStep: () => {
      if(step >= stepsCount - 1) {
        return
      }
      setStep(step + 1);
    },
    goPrevStep: () => {
      if(step <= 0) {
        return
      }
      setStep(step - 1);
    },
  }

  return (
    <Component {...props} {...screenProps}>
      {Children.map(children, (child, index) => {
        console.log("child index:", index)
        console.log("child step:", step)
        return step === index ? cloneElement(child, {...screenProps}) : null
      })}
    </Component>
  );

};

export default Wizard;
