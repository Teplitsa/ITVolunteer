import { ReactElement, useEffect } from "react";
import Router from "next/router";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import { WizardScreen } from "../../layout/WizardScreen";

const CompleteTaskThanks = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Thanks",
  };

  const { user, task } = useStoreState(
    state => state.components.completeTaskWizard
  );

  const setTaskToPortfolioWizardState = useStoreActions(actions => actions.components.taskToPortfolioWizard.setInitState);

  const exitWizard = event => {
    event.preventDefault();
    // console.log("exitWizard path:", "/tasks/" + props.task.slug);
    
    if(user.isAuthor) {
      Router.push("/tasks/[slug]", "/tasks/" + task.slug);
    }
    else {
      console.log("setTaskToPortfolioWizardState task:", task);
      setTaskToPortfolioWizardState({
        task: _.cloneDeep(task),
        doer: _.cloneDeep(user),
      });
      Router.push("/task-to-portfolio");
    }
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
