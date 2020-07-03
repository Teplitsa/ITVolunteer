import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { WizardScreenBottomBar } from "../layout/WizardScreen";
import BottomIcon from "../../assets/img/icon-task-list-gray.svg";


export const AgreementScreen = (props) => {

  return (
    <div className="wizard-screen agreement">
      <div className="wizard-form">
        <h1>Что должен знать автор задачи перед ее постановкой</h1>
      </div>

      <WizardScreenBottomBar {...props} icon={BottomIcon} title="Создание задачи" />
    </div>
  );

};


export const SetTaskTitleScreen = (props) => {

  return (
    <div className="wizard-screen">

      <div className="wizard-form">
        <h1>
          <span>{props.step + 1} →</span>
          Название задачи <span className="wizard-form__required-star">*</span>
        </h1>
      </div>

      <WizardScreenBottomBar {...props} icon={BottomIcon} title="Создание задачи" />
    </div>
  );

};

export const SetTaskDescriptionScreen = (props) => {

  return (
    <div className="wizard-screen">

      <div className="wizard-form">
        <h1>Опишите, что нужно сделать *</h1>
      </div>

      <WizardScreenBottomBar {...props} icon={BottomIcon} title="Создание задачи" />
    </div>
  );

};
