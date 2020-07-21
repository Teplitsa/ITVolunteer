import { ReactElement, useState, useEffect } from "react";
import * as _ from "lodash";
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";

import {
  IWizardScreenProps,
} from "../../model/model.typing";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { WizardScreen, WizardScreenBottomBar,  WizardForm, 
  WizardStringField, WizardTextField, WizardRadioSetField, WizardSelectField,
  WizardMultiSelectField, WizardUploadImageField,
} from "../layout/WizardScreen";

import bottomIcon from "../../assets/img/icon-task-list-gray.svg";
import howToIcon from "../../assets/img/icon-question-green.svg";
import inputCheckOn from "../../assets/img/icon-wizard-check-on.svg";
import inputCheckOff from "../../assets/img/icon-wizard-check-off.svg";
import calendarIcon from "../../assets/img/icon-wizard-calendar.svg";

export const AgreementScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "AgreementScreen",
  }

  const [isValid, setIsValid] = useState(false)
  const formData = useStoreState((state) => state.components.createTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.createTaskWizard.setFormData)
  const agreementItems = ["isNgo", "isKnowVolunteer"]

  useEffect(() => {
    console.log("formData:", formData)
    let isValidTmp = agreementItems.reduce((isValidAccum, agreementItemName) => {
      return isValidAccum && _.get(formData, "agreement." + agreementItemName, false)
    }, true)
    setIsValid(isValidTmp)
  }, [formData])

  function handleAgreementItemCheckClick(e, agreementItemName) {
    _.set(formData, "agreement." + agreementItemName, !_.get(formData, "agreement." + agreementItemName, false))
    setFormData(formData)
  }

  function handleContinueClick(e) {
    e.preventDefault();
    if(!isValid) {
      return
    }
    props.goNextStep();
  }

  return (
    <WizardScreen {...props} isShowHeader={false}>
      <div className={`wizard-screen screen-agreement ${isValid ? "" : "invalid"}`}>
        <div className="screen-agreement__content">
          <h1>Что должен знать автор задачи перед ее постановкой</h1>
          <p className="screen-agreement__explanation">Публикуя задачу на платформе IT-волонтер, я соглашаюсь с правилами.</p>
          <div className="screen-agreement-list">
            <div className="screen-agreement-list__item">
              <h2>Я ставлю задачу от имени некоммерческой организации или инициативы</h2>
              <div className="screen-agreement-list__check" onClick={(e) => handleAgreementItemCheckClick(e, "isNgo")}>
                <img src={_.get(formData, "agreement.isNgo", false) ? inputCheckOn : inputCheckOff} />
              </div>
              <p>
                Для IT-волонтеров важны некоммерческие цели и социальный эффект от той помощи, которую они вам оказывают. Поэтому они готовы помогать только социально ориентированным некоммерческим организациям, социальным проектам и инициативам.              
              </p>
              <p>
                К сожалению, на платформе не публикуются задачи от коммерческих, религиозных или политических организаций. Почему? (Линк на правила со списком СО НКО.)
              </p>
            </div>
            <div className="screen-agreement-list__item">
              <h2>Я понимаю, как работать с волонтерами, и хочу заботиться об их мотивации</h2>
              <div className="screen-agreement-list__check" onClick={(e) => handleAgreementItemCheckClick(e, "isKnowVolunteer")}>
                <img src={_.get(formData, "agreement.isKnowVolunteer", false) ? inputCheckOn : inputCheckOff} />
              </div>
              <p>
                Прочитайте (ссылка), какие советы дают опытные IT-волонтеры: как правильно поставить задачу, как мотивировать помогать вам, как избежать распространенных ошибок.
              </p>
              <p>
                Прочитайте (ссылка), какие советы дают опытные IT-волонтеры: как правильно поставить задачу, как мотивировать помогать вам, как избежать распространенных ошибок.
              </p>
              <p>
                Прочитайте (ссылка), какие советы дают опытные IT-волонтеры: как правильно поставить задачу, как мотивировать помогать вам, как избежать распространенных ошибок.
              </p>
              <p>
                Прочитайте (ссылка), какие советы дают опытные IT-волонтеры: как правильно поставить задачу, как мотивировать помогать вам, как избежать распространенных ошибок.
              </p>
            </div>
          </div>
        </div>
        <div className="screen-agreement__list-overlay"></div>
        <div className="screen-agreement__bottom-bar">
          <a href="#" onClick={handleContinueClick} className={`screen-agreement__primary-button ${isValid ? "" : "disabled"}`}>Соглашаюсь с правилами</a>
        </div>
      </div>
    </WizardScreen>
  );

};


export const CreateTaskHelp = (props: IWizardScreenProps) => {
  const setShowScreenHelpModalState = useStoreActions((actions) => actions.components.createTaskWizard.setShowScreenHelpModalState)
  const howtoTitle = _.get(props, "howtoTitle", "Как правильно дать название задачи")

  function handleShowHelpClick(e) {
    e.preventDefault();
    setShowScreenHelpModalState({[props.screenName]: true});
  }

  return (
      <div className="wizard-field__help" onClick={handleShowHelpClick}>
        <img src={howToIcon} className="wizard-field__icon" />
        <span>{howtoTitle}</span>
      </div>
  )
}


export const SetTaskTitleScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SetTaskTitleScreen",
  }

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
            formHelpComponent={CreateTaskHelp}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskDescriptionScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SetTaskDescriptionScreen",
  }

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
            formHelpComponent={CreateTaskHelp}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskResultScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SetTaskResultScreen",
  }

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
            formHelpComponent={CreateTaskHelp}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskImpactScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SetTaskImpactScreen",
  }

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
            formHelpComponent={CreateTaskHelp}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskReferencesScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SetTaskReferencesScreen",
  }

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
            formHelpComponent={CreateTaskHelp}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SetTaskRemoteResourcesScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SetTaskRemoteResourcesScreen",
  }

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
            formHelpComponent={CreateTaskHelp}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const UploadTaskFilesScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "UploadTaskFilesScreen",
  }

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Добавьте файлы к задаче"
          isRequired={false}
          {...props}
        >
          <WizardUploadImageField {...props} 
            isMultiple={true}
            name="files"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskTagsScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SelectTaskTagsScreen",
  }

  const taskTagList = useStoreState((state) => state.components.createTaskWizard.taskTagList)

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Категория задачи"
          isRequired={true}
          {...props}
        >
          <WizardMultiSelectField {...props} 
            name="taskTags"
            selectOptions={taskTagList.map((term: any) => {return {
              value: term.term_id, 
              title: term.name
            }})}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskNgoTagsScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SelectTaskNgoTagsScreen",
  }

  const ngoTagList = useStoreState((state) => state.components.createTaskWizard.ngoTagList)

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Направление помощи"
          isRequired={true}
          {...props}
        >
          <WizardMultiSelectField {...props} 
            name="ngoTags"
            selectOptions={ngoTagList.map((term: any) => {return {
              value: term.term_id, 
              title: term.name
            }})}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskPreferredDoerScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SelectTaskPreferredDoerScreen",
  }

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Кто может откликнуться на задачу?"
          isRequired={false}
          {...props}
        >
          <WizardRadioSetField {...props} 
            selectOptions={[{value: 1, title: "Любой волонтёр"}, {value: 2, title: "Пасека"}]}
            name="preferredDoers"
            howtoTitle="Что такое пасека" 
            formHelpComponent={CreateTaskHelp}
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskRewardScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SelectTaskRewardScreen",
  }
  const rewardList = useStoreState((state) => state.components.createTaskWizard.rewardList)

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Какое будет вознаграждение"
          isRequired={true}
          {...props}
        >
          <WizardSelectField {...props} 
            selectOptions={rewardList.map((term: any) => {return {
              value: term.term_id, 
              title: term.name
            }})}
            name="reward"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const CustomDeadlineDate = (props: IWizardScreenProps) => {
  const [customDate, setCustomDate] = useState(null)
  const [isShowDatePicker, setIsShowDatePicker] = useState(false)
  const formData = useStoreState((state) => state.components.createTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.createTaskWizard.setFormData)

  useEffect(() => {
    let selectedValue = _.get(formData, props.name + ".value", "")
    let date = _.get(formData, props.name + ".customDate", null)

    if(customDate && selectedValue !== moment(customDate).toISOString()) {
      setCustomDate(null)
      _.set(formData, props.name + ".customDate", null)
    }
    else if(!customDate && date) {
      setCustomDate(date)
      _.set(formData, props.name + ".value", moment(date).toISOString())
    }

  }, [formData])

  useEffect(() => {
  }, [formData])

  function handleOptionClick(e) {
    setIsShowDatePicker(!isShowDatePicker)
  }

  function handleDatePickerClick(e) {
    e.stopPropagation()
  }

  return (
      <div className="wizard-radio-option" onClick={handleOptionClick}>
        <div className="wizard-radio-option__check">
          <img src={calendarIcon} />
        </div>
        <span className="wizard-radio-option__title">{customDate ? moment(customDate).format("DD-MM-YYYY") : "Выбрать свой срок"}</span>

        {!!isShowDatePicker &&
        <div className="wizard-radio-option__datepicker" onClick={handleDatePickerClick}>
          <DatePicker
            selected={customDate}
            dateFormat="YYYY-MM-DD"
            locale="ru-RU"
            inline
            onChange={(date) => {
              _.set(formData, props.name + ".value", moment(date).toISOString())
              _.set(formData, props.name + ".customDate", date)
              setCustomDate(date)
              setFormData(formData)
              setIsShowDatePicker(false)
            }}
          />
        </div>
        }
      </div>
  )
}


export const SelectTaskPreferredDurationScreen = (screenProps: IWizardScreenProps) => {
  const nowDateTime = useStoreState((state) => state.components.createTaskWizard.now)
  const props = {
    ...screenProps,
    screenName: "SelectTaskPreferredDurationScreen",
  }

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Желаемый срок завершения задачи"
          isRequired={false}
          {...props}
        >
          <WizardRadioSetField {...props} 
            selectOptions={[
              {value: "", title: "Неважно"}, 
              {value: moment(nowDateTime).add(3, 'days').toISOString(), title: "Через 3 дня"}, 
              {value: moment(nowDateTime).add(7, 'days').toISOString(), title: "Через неделю"}
            ]}
            customOptions={[CustomDeadlineDate]}
            name="preferredDuration"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};


export const SelectTaskCoverScreen = (screenProps: IWizardScreenProps) => {
  const props = {
    ...screenProps,
    screenName: "SelectTaskCoverScreen",
  }

  return (
    <WizardScreen {...props}>
      <div className="wizard-screen">
        <WizardForm
          title="Добавьте обложку к задаче, это увеличит ее привлекательность"
          isRequired={false}
          {...props}
        >
          <WizardUploadImageField {...props} 
            name="cover"
          />
        </WizardForm>
        <WizardScreenBottomBar {...props} icon={bottomIcon} title="Создание задачи" />
      </div>
    </WizardScreen>
  );

};
