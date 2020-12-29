import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
// import Router from "next/router";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import TaskToPortfolioIntro from "../components/task-actions/task-to-portfolio/TaskToPortfolioIntro";
import Wizard from "../components/Wizard";

const TaskToPortfolio: React.FunctionComponent = (): ReactElement => {
  const { step, formData, doer, task, isNeedReset } = useStoreState(
    state => state.components.taskToPortfolioWizard
  );
  const {
    setStep,
    resetStep,
    setFormData,
    resetFormData,
    loadWizardData,
    saveWizardData,
    removeWizardData,
    newPortfolioItemRequest,
    resetWizard,
    setNeedReset,
  } = useStoreActions(actions => actions.components.taskToPortfolioWizard);

  useEffect(() => {
    loadWizardData();
    if (isNeedReset) {
      setNeedReset(false);
      saveWizardData();
    }
  }, []);

  function handleCompleteWizard() {
    const { title, description, demoLink, preview, fullImage } = formData as {
      title: string;
      description: string;
      demoLink: string;
      preview?: number;
      fullImage?: number;
    };
    newPortfolioItemRequest({
      doer,
      task,
      title,
      description,
      demoLink,
      preview, 
      fullImage
    });
    resetWizard();
    resetFormData();
    setStep(4);
    saveWizardData();
  }

  function handleCancelWizard(event) {
    event.preventDefault();
    resetWizard();
    resetFormData();
    resetStep();
    removeWizardData();
    // Router.push("/tasks");
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
        <TaskToPortfolioIntro isIgnoreStepNumber={true} />
      </Wizard>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "task-to-portfolio" },
    entrypointType: "page",
    componentModel: () => {
      return ["task-to-portfolio", null];
    },
  });

  return {
    props: { ...model },
  };
};

export default TaskToPortfolio;
