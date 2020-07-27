import { ReactElement } from "react";
import { WizardScreen } from "../../layout/WizardScreen";

const CompleteTaskCongratulations = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Congratulations",
    onNextClick: (event) => {
      event.preventDefault();
      props.goNextStep();
    },
  };

  return (
    <WizardScreen {...props} modifierClassNames={["wizard_complete-intro"]}>
      <div className="wizard-screen">
        <h1 className="wizard-screen__main-title">
          Поздравляем с закрытием задачи!
        </h1>
        <div className="wizard-screen__subtitle">
          Александр Гусев будет рад услышать отзыв о его работе
        </div>
        <a
          href="#"
          onClick={props.onNextClick}
          className="wizard-screen__button wizard-screen__button_primary"
        >
          Продолжить
          <span className="wizard-screen__tip wizard-screen__tip_primary">
            +10 баллов за ваш отзыв
          </span>
        </a>
      </div>
    </WizardScreen>
  );
};

export default CompleteTaskCongratulations;
