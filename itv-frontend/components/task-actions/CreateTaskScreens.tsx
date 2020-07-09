import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { WizardScreenBottomBar, WizardStringField, WizardTextField, WizardForm } from "../layout/WizardScreen";

import bottomIcon from "../../assets/img/icon-task-list-gray.svg";
import howToIcon from "../../assets/img/icon-question-green.svg";


export const AgreementScreen = (props) => {

  return (
    <div className="wizard-screen agreement">
      <h1>Что должен знать автор задачи перед ее постановкой</h1>
      <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
    </div>
  );

};


export const CreateTaskHelp = (props) => {
  const howtoTitle = _.get(props, "howtoTitle", "Как правильно дать название задачи")

  return (
      <div className="wizard-field__help">
        <img src={howToIcon} className="wizard-field__icon" />
        <span>{howtoTitle}</span>
      </div>
  )
}


export const SetTaskTitleScreen = (props) => {

  console.log("props:", props)

  return (
    <div className="wizard-screen">
      <WizardForm
        title="Название задачи"
        isRequired={true}
        {...props}
      >
        <WizardStringField {...props} 
          placeholder="Например, «Разместить счётчик на сайте»" 
          maxLength={50}
          formHelpComponent={<CreateTaskHelp {...props} />}
        />
      </WizardForm>
      <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
    </div>
  );

};


export const SetTaskDescriptionScreen = (props) => {

  return (
    <div className="wizard-screen">

      <div className="wizard-form">
        <WizardForm
          title="Опишите, что нужно сделать"
          isRequired={true}
          {...props}
        >
          <WizardTextField {...props} 
            placeholder="Какая задача стоит перед IT-волонтером?" 
            howtoTitle="Как правильно дать название задачи" 
            maxLength={250}
          />
        </WizardForm>
      </div>

      <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
    </div>
  );

};
