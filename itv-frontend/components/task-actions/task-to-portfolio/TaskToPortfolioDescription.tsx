import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardTextField,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const TaskToPortfolioDescription = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "Description",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title={"Расскажите, в чем заключалась ваша работа"}
          isRequired={true}
          {...props}
        >
          <WizardTextField
            {...props}
            name="description"
            placeholder="Опишите, что вы сделали, в чем была сложность, что вызвало удовольствие. Каким решением, вы гордитесь"
            maxLength={450}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={props.bottomBarIcon} title={props.bottomBarTitle} />
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioDescription;
