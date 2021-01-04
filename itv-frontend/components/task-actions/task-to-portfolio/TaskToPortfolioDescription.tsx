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
          title={"Как бы вы описали задачу"}
          isRequired={true}
          {...props}
        >
          <WizardTextField
            {...props}
            name="description"
            placeholder="Например, Помощь в разработке баннера"
            maxLength={450}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={props.bottomBarIcon} title={props.bottomBarTitle} />
      </div>
    </WizardScreen>
  );
};

export default TaskToPortfolioDescription;
