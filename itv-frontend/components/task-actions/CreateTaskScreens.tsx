import { ReactElement } from "react";
import * as _ from "lodash"

import {
  IWizardScreenProps,
} from "../../model/model.typing";
import { useStoreState } from "../../model/helpers/hooks";
import { WizardScreen, WizardScreenBottomBar, WizardStringField, WizardTextField, WizardForm } from "../layout/WizardScreen";

import bottomIcon from "../../assets/img/icon-task-list-gray.svg";
import howToIcon from "../../assets/img/icon-question-green.svg";


export const AgreementScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props} isShowHeader={false}>
      <div className="wizard-screen agreement">
        <h1>Что должен знать автор задачи перед ее постановкой</h1>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const CreateTaskHelp = (props: IWizardScreenProps) => {
  const howtoTitle = _.get(props, "howtoTitle", "Как правильно дать название задачи")

  return (
      <div className="wizard-field__help">
        <img src={howToIcon} className="wizard-field__icon" />
        <span>{howtoTitle}</span>
      </div>
  )
}


export const SetTaskTitleScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Название задачи"
          isRequired={true}
          {...props}
        >
          <WizardStringField {...props} 
            name="title"
            placeholder="Например, «Разместить счётчик на сайте»" 
            maxLength={50}
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskDescriptionScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen>
      <div className="wizard-screen">
        <WizardForm
          title="Опишите, что нужно сделать"
          isRequired={true}
          {...props}
        >
          <WizardTextField {...props} 
            name="description"
            placeholder="Какая задача стоит перед IT-волонтером?" 
            howtoTitle="Как правильно составить описание задачи" 
            maxLength={250}
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskResultScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Что должно получится в результате"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="result"
            placeholder="Каково ваше видение завершенной задачи" 
            howtoTitle="Как правильно составить описание задачи" 
            maxLength={250}
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskImpactScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Эффект от работы. Чем будет гордиться IT-волонтер?"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="impact"
            placeholder="Кому поможет проект, в котором будет помогать волонтер" 
            howtoTitle="Как правильно составить описание задачи" 
            maxLength={250}
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskReferencesScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Есть ли какие-то примеры, которые вам нравятся"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="references"
            placeholder={`Примеры или "референсы" позволят волонтеру значительно лучше понять ваш замысел`} 
            howtoTitle="Как правильно составить описание задачи" 
            maxLength={250}
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskRemoteResourcesScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Добавьте ссылки на внешние файлы"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="externalFileLinks"
            placeholder="Например, на Техническое задание или какие-то другие внешние файлы" 
            howtoTitle="Как правильно составить описание задачи" 
            maxLength={250}
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const UploadTaskFilesScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Добавьте файлы к задаче"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="files"
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskTagsScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Категория задачи"
          isRequired={true}
          {...props}
        >
          <WizardTextField {...props} 
            name="taskTags"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskNgoTagsScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Направление помощи"
          isRequired={true}
          {...props}
        >
          <WizardTextField {...props} 
            name="ngoTags"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskPreferredDoerScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Кто может откликнуться на задачу?"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="preferredDoers"
            howtoTitle="Что такое пасека" 
            maxLength={250}
            formHelpComponent={<CreateTaskHelp {...props} />}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskRewardScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Какое будет вознагрождение"
          isRequired={true}
          {...props}
        >
          <WizardTextField {...props} 
            name="reward"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskPreferredDurationScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Желаемый срок завершения задачи"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="preferredDuration"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskCoverScreen = (props: IWizardScreenProps) => {

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Добавьте обложку к задаче, это увеличит ее привлекательность"
          isRequired={false}
          {...props}
        >
          <WizardTextField {...props} 
            name="cover"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};
