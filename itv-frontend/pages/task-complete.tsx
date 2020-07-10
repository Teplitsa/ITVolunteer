import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import { 
  CongratulationsScreen, RateRequirementsQuality
} from "../components/task-actions/CompleteTaskScreens";
import WizardScreen from "../components/layout/WizardScreen";
import Wizard from "../components/hoc/Wizard";

const CreateTask: React.FunctionComponent = (): ReactElement => {
  const formData = useStoreState((state) => state.components.completeTaskWizard.formData)
  const setFormData = useStoreActions((actions) => actions.components.completeTaskWizard.setFormData)
  const step = useStoreState((state) => state.components.completeTaskWizard.step)
  const setStep = useStoreActions((actions) => actions.components.completeTaskWizard.setStep)
  const loadWizardData = useStoreActions((actions) => actions.components.completeTaskWizard.loadWizardData)
  const saveWizardData = useStoreActions((actions) => actions.components.completeTaskWizard.saveWizardData)

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
        <CongratulationsScreen isIgnoreStepNumber={true} />
        <RateRequirementsQuality />
      </Wizard>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/task-complete";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "task-complete" },
    entrypointType: "page",
    componentModel: (request) => {
      return ["task-complete", null];
    },
  });

  return {
    props: { ...model },
  };
};

export default CreateTask;
