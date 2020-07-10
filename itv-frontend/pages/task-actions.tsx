import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import { 
  AgreementScreen, SetTaskTitleScreen, SetTaskDescriptionScreen,
  SetTaskResultScreen, SetTaskImpactScreen, SetTaskReferencesScreen,
  SetTaskRemoteResourcesScreen, UploadTaskFilesScreen,
  SelectTaskTagsScreen, SelectTaskNgoTagsScreen, SelectTaskPreferredDoerScreen,
  SelectTaskRewardScreen, SelectTaskPreferredDurationScreen, SelectTaskCoverScreen
} from "../components/task-actions/CreateTaskScreens";
import WizardScreen from "../components/layout/WizardScreen";
import Wizard from "../components/hoc/Wizard";

const CreateTask: React.FunctionComponent = (): ReactElement => {
  const formData = useStoreState((state) => state.components.createTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.createTaskWizard.setFormData)
  const step = useStoreState((state) => state.components.createTaskWizard.step)
  const setStep = useStoreActions((actions) => actions.components.createTaskWizard.setStep)
  const loadWizardData = useStoreActions((actions) => actions.components.createTaskWizard.loadWizardData)
  const saveWizardData = useStoreActions((actions) => actions.components.createTaskWizard.saveWizardData)

  useEffect(() => {
    loadWizardData()
  }, [])  

  useEffect(() => {
  }, [step])  

  return (
    <>
      <DocumentHead />
      <Wizard component={WizardScreen} 
        step={step} 
        formData={formData} 
        setStep={setStep} 
        setFormData={setFormData} 
        saveWizardData={saveWizardData}
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
        <SelectTaskPreferredDoerScreen />
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
    "../model/helpers/with-app-and-entrypoint-model"
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
