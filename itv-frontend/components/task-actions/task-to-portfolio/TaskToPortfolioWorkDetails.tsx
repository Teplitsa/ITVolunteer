import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardTextField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const TaskToPortfolioWorkDetails = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "WorkDetails",
  };

  // console.log("TaskToPortfolioWorkDetails props:", props);

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={"Расскажите, в чем заключалась ваша работа"}
          isRequired={false}
          isAllowPrevButton={true}
          {...props}
        >
          <WizardTextField
            {...props}
            name="workDetails"
            placeholder="Опишите, что вы сделали, в чем была сложность, что вызвало удовольствие. Каким решением, вы гордитесь"
            maxLength={450}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={props.bottomBarIcon} title={props.bottomBarTitle} />
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioWorkDetails;
