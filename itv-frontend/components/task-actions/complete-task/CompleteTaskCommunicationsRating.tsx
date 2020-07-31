import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardRating,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";

const CompleteTaskCommunicationsRating = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "CommunicationsRating",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Оцените комфортно ли было общение"
          isRequired={true}
          {...props}
        >
          <WizardRating {...props} name="communicationRating" />
        </WizardForm>
        <WizardScreenBottomBar {...props} />
      </div>
    </WizardScreen>
  );
};

export default CompleteTaskCommunicationsRating;
