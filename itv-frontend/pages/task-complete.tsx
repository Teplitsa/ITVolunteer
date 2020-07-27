import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import CompleteTaskCongratulations from "../components/task-actions/complete-task/CompleteTaskCongratulations";
import CompleteTaskQualityRating from "../components/task-actions/complete-task/CompleteTaskQualityRating";
import CompleteTaskCommunicationsRating from "../components/task-actions/complete-task/CompleteTaskCommunicationsRating";
import CompleteTaskReview from "../components/task-actions/complete-task/CompleteTaskReview";
import CompleteTaskThanks from "../components/task-actions/complete-task/CompleteTaskThanks";
import Wizard from "../components/Wizard";

const CreateTask: React.FunctionComponent = (): ReactElement => {
  const formData = useStoreState(
    (state) => state.components.completeTaskWizard.formData
  );
  const setFormData = useStoreActions(
    (actions) => actions.components.completeTaskWizard.setFormData
  );
  const step = useStoreState(
    (state) => state.components.completeTaskWizard.step
  );
  const setStep = useStoreActions(
    (actions) => actions.components.completeTaskWizard.setStep
  );
  const loadWizardData = useStoreActions(
    (actions) => actions.components.completeTaskWizard.loadWizardData
  );
  const saveWizardData = useStoreActions(
    (actions) => actions.components.completeTaskWizard.saveWizardData
  );

  useEffect(() => {
    loadWizardData();
  }, []);

  useEffect(() => {}, [step]);

  return (
    <>
      <DocumentHead />
      <Wizard
        step={step}
        formData={formData}
        setStep={setStep}
        setFormData={setFormData}
        saveWizardData={saveWizardData}
      >
        <CompleteTaskCongratulations isIgnoreStepNumber={true} />
        <CompleteTaskQualityRating />
        <CompleteTaskCommunicationsRating />
        <CompleteTaskReview />
        <CompleteTaskThanks isIgnoreStepNumber={true} />
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
