import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { WizardScreenBottomBar, WizardStringField, WizardTextField, WizardForm } from "../layout/WizardScreen";

import bottomIcon from "../../assets/img/icon-task-list-gray.svg";
import howToIcon from "../../assets/img/icon-question-green.svg";


export const CongratulationsScreen = (props) => {

  return (
    <div className="wizard-screen agreement">
      <h1>Поздравляем с закрытием задачи!</h1>
      <WizardScreenBottomBar {...props} />
    </div>
  );

};


export const RateRequirementsQuality = (props) => {

  return (
    <div className="wizard-screen">
      <WizardForm
        title="Насколько точно было составлено ТЗ"
        isRequired={false}
        {...props}
      >
        <WizardStringField {...props} 
          name="requirementRating"
        />
      </WizardForm>
      <WizardScreenBottomBar {...props} />
    </div>
  );

};
