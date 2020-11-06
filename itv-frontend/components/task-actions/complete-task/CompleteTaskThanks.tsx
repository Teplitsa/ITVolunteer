import { ReactElement, useEffect } from "react";
import Router from "next/router";
import { useStoreActions } from "../../../model/helpers/hooks";
import { WizardScreen } from "../../layout/WizardScreen";

const CompleteTaskThanks = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Thanks",
  };
  const { resetStep, removeWizardData, setNeedReset } = useStoreActions(
    actions => actions.components.completeTaskWizard
  );
  const exitWizard = event => {
    event.preventDefault();
    setNeedReset(true);
    resetStep();
    removeWizardData();
    Router.push({
      pathname: "/tasks",
    });
  };

  useEffect(() => {
    window.addEventListener("blur", exitWizard);
    window.addEventListener("beforeunload", exitWizard);
    return () => {
      window.removeEventListener("blur", exitWizard);
      window.removeEventListener("beforeunload", exitWizard);
    };
  }, []);

  return (
    <WizardScreen {...props} modifierClassNames={["wizard_complete-fireworks"]}>
      <div className="wizard-screen">
        <h1 className="wizard-screen__main-title">Спасибо за ваш отзыв!</h1>
        <div className="wizard-screen__subtitle">
          Вам начислено <span className="wizard-screen__subtitle-mark">10 баллов</span>!
        </div>
        <a
          href="#"
          onClick={exitWizard}
          className="wizard-screen__button wizard-screen__button_primary"
        >
          Продолжить
        </a>
      </div>
    </WizardScreen>
  );
};

export default CompleteTaskThanks;
