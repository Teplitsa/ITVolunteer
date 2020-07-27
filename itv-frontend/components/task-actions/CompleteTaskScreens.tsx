import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { WizardScreen, WizardScreenBottomBar, WizardStringField, WizardTextField, WizardForm, WizardFormActionBar } from "../layout/WizardScreen";

import bottomIcon from "../../assets/img/icon-task-list-gray.svg";
import howToIcon from "../../assets/img/icon-question-green.svg";


export const CongratulationsScreen = (screenProps) => {
  const props = {
    ...screenProps,
    screenName: "CongratulationsScreen",
  }
console.log(props)
  return (
    <WizardScreen {...props}>
      <div className="wizard-screen agreement">
        <h1>Поздравляем с закрытием задачи!</h1>
        <WizardFormActionBar  {...props} isAllowPrevButton={false}/>
      </div>
    </WizardScreen>
  );

};


export const RateRequirementsQuality = (screenProps) => {
  const props = {
    ...screenProps,
    screenName: "RateRequirementsQuality",
  }

  return (
    <WizardScreen {...props}>
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
    </WizardScreen>
  );

};
