import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import { WizardScreen } from "../../layout/WizardScreen";

const CompleteTaskCongratulations = (screenProps): ReactElement => {
  const isAuthor = useStoreState(state => state.components.completeTaskWizard.user.isAuthor);
  const partnerName = useStoreState(state => state.components.completeTaskWizard.partner.name);
  const props = {
    ...screenProps,
    screenName: "Congratulations",
  };

  return (
    <WizardScreen {...props} modifierClassNames={["wizard_complete-intro"]}>
      <div className="wizard-screen">
        <h1 className="wizard-screen__main-title">Поздравляем с закрытием задачи!</h1>
        <div className="wizard-screen__subtitle">
          {partnerName}{" "}
          {isAuthor
            ? "будет рад(а) услышать отзыв о работе"
            : "будет рад(а) услышать отзыв о его(её) задаче"}
        </div>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            screenProps.goNextStep();
          }}
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
