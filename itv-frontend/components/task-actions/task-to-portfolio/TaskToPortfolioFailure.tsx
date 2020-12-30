import { ReactElement } from "react";
import { WizardScreen } from "../../layout/WizardScreen";

const TaskToPortfolioFailure = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Failure",
    onStartClick: event => {
      event.preventDefault();
      props.goNextStep(2);
    },
  };

  return (
    <WizardScreen {...props} modifierClassNames={["wizard_to-portfolio-failure"]}>
      <div className="wizard-screen">
        <h1 className="wizard-screen__main-title">Очень жаль!</h1>
        <div className="wizard-screen__subtitle">Хотите добавить работу в портфолио?</div>
        <a
          href="#"
          onClick={props.onWizardCancel}
          className="wizard-screen__button wizard-screen__button_primary"
        >
          К списку задач
        </a>
        <div className="wizard-screen__cancel">
          <a href="#" className="btn btn_link-extra" onClick={props.onStartClick}>
            Добавить в портфолио
          </a>
        </div>
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioFailure;
