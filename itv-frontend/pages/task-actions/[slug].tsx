import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from 'next/router'
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
  ITaskState,
  IFetchResult,
} from "../../model/model.typing";
import Wizard from "../../components/Wizard";
import * as utils from "../../utilities/utilities"

const EditTask: React.FunctionComponent<ITaskState> = (task): ReactElement => {
  const router = useRouter()
  const formData = useStoreState((state) => state.components.createTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.createTaskWizard.setFormData)
  const step = useStoreState((state) => state.components.createTaskWizard.step)
  const setStep = useStoreActions((actions) => actions.components.createTaskWizard.setStep)
  const loadWizardData = useStoreActions((actions) => actions.components.createTaskWizard.loadWizardData)
  const saveWizardData = useStoreActions((actions) => actions.components.createTaskWizard.saveWizardData)
  const loadTaxonomyData = useStoreActions((actions) => actions.components.createTaskWizard.loadTaxonomyData)

  useEffect(() => {
    console.log("task:", task)
    setFormData({
      ...task,
      title: task.title,
      description: task.content ? task.content.replace(/(<([^>]+)>)/ig, "") : null,
      cover: task.cover ? [{
        url: task.cover.mediaItemUrl,
        value: task.cover.databaseId,
        fileName: task.cover.mediaItemUrl.replace(/^.*[\\\/]/, '')
      }] : [],
      files: task.files.map((file) => {
        return {
          url: file.mediaItemUrl,
          value: file.databaseId,
          fileName: file.mediaItemUrl.replace(/^.*[\\\/]/, '')
        }
      }),
      taskTags: {
        value: task.tags.nodes.map((node: any) => {
          return String(node.databaseId)
        })
      },
      ngoTags: {
        value: task.ngoTaskTags.nodes.map((node: any) => {
          return String(node.databaseId)
        })
      },
      reward: {
        value: String(_.get(task.rewardTags.nodes, "0.databaseId", "")),
      },
    })
  }, [task])

  useEffect(() => {
    // loadWizardData()
    loadTaxonomyData()
  }, [])  

  useEffect(() => {
  }, [step]) 

  function handleCompleteWizard() {
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

            router.push("/tasks/" + result.taskSlug)
            setFormData({})
        },
        (error) => {
            utils.showAjaxError({action, error})
        }
    )    
  } 

  function handleCancelWizard(e) {
    e.preventDefault()
    Router.push("/tasks/" + task.slug)
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
        <SetTaskTitleScreen />
        <SetTaskDescriptionScreen />
        <SetTaskResultScreen />
        <SetTaskImpactScreen />
        <SetTaskReferencesScreen />
        <SetTaskRemoteResourcesScreen />
        <UploadTaskFilesScreen />
        <SelectTaskTagsScreen />
        <SelectTaskNgoTagsScreen />
        <SelectTaskPreferredDoerScreen />
        <SelectTaskRewardScreen />
        <SelectTaskPreferredDurationScreen />
        <SelectTaskCoverScreen />
      </Wizard>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { slug },
}) => {
  const url: string = "/task-actions";
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "task-actions", slug },
    entrypointType: "page",
    componentModel: async (request) => {
      const taskModel = await import("../../model/task-model/task-model");
      const taskQuery = taskModel.graphqlQuery.getBySlug;
      const { task: component } = await request(
        process.env.GraphQLServer,
        taskQuery,
        { taskSlug: slug }
      );

      return ["task-actions", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default EditTask;
