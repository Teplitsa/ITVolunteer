import { ReactElement } from "react";
// import { useStoreState } from "../../../model/helpers/hooks";
import { WizardScreen } from "../../layout/WizardScreen";

const TaskToPortfolioIntro = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Intro",
  };

  return (
    <WizardScreen {...props} modifierClassNames={["wizard_to-portfolio-intro"]}>
      <div className="wizard-screen">
        <h1 className="wizard-screen__main-title">
          Заказчик оценил вашу работу
          <br />
          на высшие баллы
        </h1>
        <div className="wizard-screen__subtitle">
          Хотите добавить в портфолио
          <br />
          задачу &laquo;<a href="#">Нужен сайт на Word Press</a>&raquo;?
        </div>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            screenProps.goNextStep(2);
          }}
          className="wizard-screen__button wizard-screen__button_primary"
        >
          Добавить в портфолио
          <span className="wizard-screen__tip wizard-screen__tip_primary">
            +10 баллов в награду
          </span>
        </a>
        <div className="wizard-screen__cancel">
          <a href="#" className="btn btn_link-extra" onClick={(event) => {
            event.preventDefault();
            screenProps.goNextStep();
          }}>
            Отмена
          </a>
        </div>
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioIntro;
