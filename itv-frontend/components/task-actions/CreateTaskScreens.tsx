import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { WizardScreenBottomBar, WizardStringField, WizardTextField } from "../layout/WizardScreen";
import BottomIcon from "../../assets/img/icon-task-list-gray.svg";


export const AgreementScreen = (props) => {

  return (
    <div className="wizard-screen agreement">
      <h1>Что должен знать автор задачи перед ее постановкой</h1>
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
        <WizardStringField {...props} 
          placeholder="Например, «Разместить счётчик на сайте»" 
          howtoTitle="Как правильно дать название задачи" 
          maxLength={50}
        />
      </div>

      <WizardScreenBottomBar {...props} icon={BottomIcon} title="Создание задачи" />
    </div>
  );

};

export const SetTaskDescriptionScreen = (props) => {

  return (
    <div className="wizard-screen">

      <div className="wizard-form">
        <h1>
          <span>{props.step + 1} →</span>
          Опишите, что нужно сделать <span className="wizard-form__required-star">*</span>
        </h1>
        <WizardTextField {...props} 
          placeholder="Какая задача стоит перед IT-волонтером?" 
          howtoTitle="Как правильно дать название задачи" 
          maxLength={250}
        />
      </div>

      <WizardScreenBottomBar {...props} icon={BottomIcon} title="Создание задачи" />
    </div>
  );

};
