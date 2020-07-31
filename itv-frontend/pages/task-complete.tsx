import { ReactElement, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import CompleteTaskCongratulations from "../components/task-actions/complete-task/CompleteTaskCongratulations";
import CompleteTaskQualityRating from "../components/task-actions/complete-task/CompleteTaskQualityRating";
import CompleteTaskCommunicationsRating from "../components/task-actions/complete-task/CompleteTaskCommunicationsRating";
import CompleteTaskReview from "../components/task-actions/complete-task/CompleteTaskReview";
import CompleteTaskThanks from "../components/task-actions/complete-task/CompleteTaskThanks";
import Wizard from "../components/Wizard";

const CreateTask: React.FunctionComponent = (): ReactElement => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const { step, formData, user, partner, task } = useStoreState(
    (state) => state.components.completeTaskWizard
  );
  const {
    setStep,
    setFormData,
    resetFormData,
    loadWizardData,
    saveWizardData,
    newReviewRequest,
  } = useStoreActions((actions) => actions.components.completeTaskWizard);

  useEffect(() => {
    loadWizardData();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && (!user.name || !partner.name || !task.databaseId)) {
      Router.push("/tasks");
    }
  }, [isLoading, user, partner, task]);

  function handleCompleteWizard() {
    const { reviewRating, communicationRating, reviewText } = formData as {
      reviewRating: number;
      communicationRating: number;
      reviewText: string;
    };
    newReviewRequest({
      reviewRating,
      communicationRating,
      reviewText,
      user,
      partner,
      task,
    });
    resetFormData();
    saveWizardData();
  }

  function handleCancelWizard(event) {
    event.preventDefault();
    resetFormData();
    saveWizardData();
    Router.push("/tasks");
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
