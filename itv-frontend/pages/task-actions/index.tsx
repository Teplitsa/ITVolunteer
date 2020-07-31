import { ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Router from 'next/router'
import * as _ from "lodash"

import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import DocumentHead from "../../components/DocumentHead";
import { 
  AgreementScreen, SetTaskTitleScreen, SetTaskDescriptionScreen,
  SetTaskResultScreen, SetTaskImpactScreen, SetTaskReferencesScreen,
  SetTaskRemoteResourcesScreen, UploadTaskFilesScreen,
  SelectTaskTagsScreen, SelectTaskNgoTagsScreen, SelectTaskPreferredDoerScreen,
  SelectTaskRewardScreen, SelectTaskPreferredDurationScreen, SelectTaskCoverScreen
} from "../../components/task-actions/CreateTaskScreens";
import {
  IFetchResult,
} from "../../model/model.typing";
import Wizard from "../../components/Wizard";
import * as utils from "../../utilities/utilities"

const CreateTask: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, token, user, isLoaded: isSessionLoaded } = useStoreState((state) => state.session);

  const formData = useStoreState((state) => state.components.createTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.createTaskWizard.setFormData)
  const step = useStoreState((state) => state.components.createTaskWizard.step)
  const setStep = useStoreActions((actions) => actions.components.createTaskWizard.setStep)
  const loadWizardData = useStoreActions((actions) => actions.components.createTaskWizard.loadWizardData)
  const saveWizardData = useStoreActions((actions) => actions.components.createTaskWizard.saveWizardData)
  const loadTaxonomyData = useStoreActions((actions) => actions.components.createTaskWizard.loadTaxonomyData)
  const resetWizard = useStoreActions((actions) => actions.components.createTaskWizard.resetWizard)
  const setWizardName = useStoreActions((actions) => actions.components.createTaskWizard.setWizardName)

  const [isPreventReset, setIsPreventReset] = useState(false)
  const isNeedReset = useStoreState((state) => state.components.createTaskWizard.isNeedReset)
  const setNeedReset = useStoreActions((actions) => actions.components.createTaskWizard.setNeedReset)

  useEffect(() => {
    setWizardName("createTaskWizard");
    loadTaxonomyData()
    loadWizardData()
  }, [])

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn)
    console.log("isSessionLoaded:", isSessionLoaded)

    if(!isSessionLoaded) {
      return
    }

    if(isLoggedIn) {
      return
    }

    Router.push("/tasks/publish/")

  }, [isLoggedIn, isSessionLoaded]) 

  useEffect(() => {
    // console.log("isNeedReset:", isNeedReset)
    // console.log("isPreventReset:", isPreventReset)

    if(isNeedReset && !isPreventReset) {
      // console.log("reset...")
      resetWizard()
      setNeedReset(false)
      saveWizardData()
    }
  }, [isNeedReset, isPreventReset]) 

  function handleCompleteWizard() {
    if(!isLoggedIn) {
      return
    }

    const submitFormData = new FormData(); 
    for(let name in formData) {
      let value;
      if(["cover", "files"].findIndex(n => n === name) > -1) {
        value = formData[name].map(item => item.value).join(",")
      }
      else if(typeof(formData[name]) === "object") {
        value = _.get(formData, name + ".value", "")
      }
      else {
        value = formData[name]
      }

      submitFormData.append( 
        name, 
        value        
      )
    }

    let action = "submit-task"
    fetch(utils.getAjaxUrl(action), {
        method: 'post',
        body: submitFormData,
    })
    .then(res => {
        try {
            return res.json()
        } catch(ex) {
            utils.showAjaxError({action, error: ex})
            return {}
        }
    })
    .then(
        (result: IFetchResult) => {
            if(result.status == 'error') {
                return utils.showAjaxError({message: "Ошибка!"})
            }

            setIsPreventReset(true)
            setNeedReset(true)
            saveWizardData()

            Router.push("/tasks/[slug]", "/tasks/" + result.taskSlug)
        },
        (error) => {
            utils.showAjaxError({action, error})
        }
    )    
  } 

  function handleCancelWizard(e) {
    e.preventDefault()

    setIsPreventReset(true)
    setNeedReset(true)
    saveWizardData()

    Router.push("/tasks/publish/")
  }

  return (
    <>
      <DocumentHead />
      <Wizard
        step={step} 
        formData={formData} 
        setStep={setStep} 
        setFormData={setFormData} 
        saveWizardData={saveWizardData}
        onWizardComplete={handleCompleteWizard}
        onWizardCancel={handleCancelWizard}
      >
        <AgreementScreen isIgnoreStepNumber={true} />
        <SetTaskTitleScreen />
        <SetTaskDescriptionScreen />
        <SetTaskResultScreen />
        <SetTaskImpactScreen />
        <SetTaskReferencesScreen />
        <SetTaskRemoteResourcesScreen />
        <UploadTaskFilesScreen />
        <SelectTaskTagsScreen />
        <SelectTaskNgoTagsScreen />
        {/*
        <SelectTaskPreferredDoerScreen />
        */}
        <SelectTaskRewardScreen />
        <SelectTaskPreferredDurationScreen />
        <SelectTaskCoverScreen />
      </Wizard>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/task-actions";
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "task-actions" },
    entrypointType: "page",
    componentModel: (request) => {
      return ["task-actions", null];
    },
  });

  return {
    props: { ...model },
  };
};

export default CreateTask;
