import { ReactElement, useState, useEffect } from "react";
import Router from 'next/router'
import * as _ from "lodash";
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import { request } from "graphql-request";
import ru from "date-fns/locale/ru";

import {
  IWizardScreenProps,
} from "../../model/model.typing";
import * as createTaskAgreementModel from "../../model/components/create-task-agreement-model";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { WizardScreen, WizardScreenBottomBar,  WizardForm, 
  WizardStringField, WizardTextField, WizardRadioSetField, WizardSelectField,
  WizardMultiSelectField, WizardUploadImageField,
} from "../layout/WizardScreen";
import TaskAdminSupport from "../../components/task/TaskAdminSupport";
import withGutenbergBlock from "../gutenberg/hoc/withGutenbergBlock";
import * as utils from "../../utilities/utilities"

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
  const [createTaskAgreement, setCreateTaskAgreement] = useState(null)
  const formData = useStoreState((state) => state.components.createTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.createTaskWizard.setFormData)
  const agreementItems = ["isNgo", "isKnowVolunteer"]

  useEffect(() => {
    // console.log("formData:", formData)
    let isValidTmp = agreementItems.reduce((isValidAccum, agreementItemName) => {
      return isValidAccum && _.get(formData, "agreement." + agreementItemName, false)
    }, true)
    setIsValid(isValidTmp)
  }, [formData])

  useEffect(() => {
    loadCreateTaskAgreementPageData()
  }, [])

  useEffect(() => {
    // console.log("createTaskAgreement:", createTaskAgreement)
  }, [createTaskAgreement])  

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

  async function loadCreateTaskAgreementPageData() {
    const pageQuery = createTaskAgreementModel.graphqlQuery;
    const { pageBy: component } = await request(
      process.env.GraphQLServer,
      pageQuery,
      { uri: "/create_task_agreement" }
    );
    setCreateTaskAgreement(component)
  }

  if(!createTaskAgreement) {
    return null
  }

  let itemIndex = 0;

  return (
    <WizardScreen {...props} isShowHeader={false}>
      <div className={`wizard-screen screen-agreement ${isValid ? "" : "invalid"}`}>
        <div className="screen-agreement__content">
          <h1>{createTaskAgreement.title}</h1>
          <p className="screen-agreement__explanation">{_.get(createTaskAgreement, "blocks.0.attributes.content", "")}</p>
          <div className="screen-agreement-list">

            {createTaskAgreement.blocks.map((block1, i1) => {
              let itemName = _.get(agreementItems, itemIndex, "")

              if(block1.__typename === "CoreHeadingBlock") {

                let itemTextBlocks = []
                for(let i2 in createTaskAgreement.blocks) {

                  let block2 = createTaskAgreement.blocks[i2]

                  if(i2 > i1) {
                    if(block2.__typename === "CoreHeadingBlock") {
                      break
                    }
                    else {
                      itemTextBlocks.push(block2)
                    }
                  }
                }

                itemIndex += 1

                return (
                  <div className="screen-agreement-list__item" key={i1}>
                    <h2>{_.get(block1, "attributes.content", "")}</h2>
                    <div className="screen-agreement-list__check" onClick={(e) => handleAgreementItemCheckClick(e, itemName)}>
                      <img src={_.get(formData, "agreement." + itemName, false) ? inputCheckOn : inputCheckOff} />
                    </div>
                    {itemTextBlocks.map((block2, i2) => {
                      return withGutenbergBlock({
                        elementName: block2.__typename,
                        props: { key: `Block-${i2}`, ...block2 },
                      });
                    })}
                  </div>
                )
              }

            })}

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
  const setHelpPageSlug = useStoreActions((actions) => actions.components.createTaskWizard.setHelpPageSlug)
  const howtoTitle = _.get(props, "howtoTitle", "")
  const howtoUrl = _.get(props, "howtoUrl", "")  

  function handleShowHelpClick(e) {
    e.preventDefault();
    // console.log("[CreateTaskHelp] props.screenName:", props.screenName)
    if(howtoUrl) {
      Router.push(howtoUrl)
    }
    else {
      setHelpPageSlug(props.helpPageSlug)
      setShowScreenHelpModalState({[props.screenName]: true});
    }
  }

  return (
      <div className="wizard-field__help" onClick={handleShowHelpClick}>

        {!!howtoTitle &&
        <>
          <img src={howToIcon} className="wizard-field__icon" />
          <span>{howtoTitle}</span>
        </>
        }

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
            howtoTitle="Как правильно дать название задачи"
            helpPageSlug="kak-pravilno-dat-nazvanie-zadachi"
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
    <WizardScreen {...props}>
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
            helpPageSlug="kak-pravilno-dat-nazvanie-zadachi" 
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
            helpPageSlug="kak-pravilno-dat-nazvanie-zadachi"
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
            helpPageSlug="kak-pravilno-dat-nazvanie-zadachi"
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
            helpPageSlug="kak-pravilno-dat-nazvanie-zadachi"
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
            helpPageSlug="kak-pravilno-dat-nazvanie-zadachi"
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
            howtoUrl="/paseka" 
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
    // console.log("customDate:", customDate)
    // console.log("formData:", formData)
    let selectedValue = _.get(formData, props.name, "")
    let isCustomDateSelected = selectedValue.match(/\d+-\d+-\d+/)

    if(customDate && !isCustomDateSelected) {
      setCustomDate(null)
    }
    else if(!customDate && isCustomDateSelected) {
      setCustomDate(selectedValue)
      _.set(formData, props.name, selectedValue)
    }

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
        <span className="wizard-radio-option__title">{customDate ? utils.getTheDate({dateString: customDate}) : "Выбрать свой срок"}</span>

        {!!isShowDatePicker &&
        <div className="wizard-radio-option__datepicker" onClick={handleDatePickerClick}>
          <DatePicker
            selected={customDate ? moment(customDate).toDate() : null}
            dateFormat="YYYY-MM-DD"
            locale="ru-RU"
            inline
            minDate={moment().add(1, 'days').toDate()}
            onChange={(date) => {
              let dateStr = moment(date).format("YYYY-MM-DD")
              _.set(formData, props.name, dateStr)
              setCustomDate(dateStr)
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
              {value: 3, title: "Через 3 дня"}, 
              {value: 7, title: "Через неделю"}
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
