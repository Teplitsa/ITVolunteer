import { ReactElement } from "react";
import {
  WizardScreen,
  WizardForm,
  WizardRating,
  WizardScreenBottomBar,
} from "../../layout/WizardScreen";
import bottomIcon from "../../../assets/img/icon-task-list-gray.svg";

const CompleteTaskQualityRating = (screenProps): ReactElement => {
  const props = {
    ...screenProps,
    screenName: "QualityRating",
  };

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Оцените качество выполнения задачи"
          isRequired={false}
          {...props}
        >
          <WizardRating {...props} name="qualityRating" />
        </WizardForm>
        <WizardScreenBottomBar
          {...props}
          icon={bottomIcon}
          title="Создание задачи"
        />
      </div>
    </WizardScreen>
  );
};

export default CompleteTaskQualityRating;
