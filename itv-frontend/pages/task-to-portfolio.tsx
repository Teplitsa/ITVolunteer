import { ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import TaskToPortfolioIntro from "../components/task-actions/task-to-portfolio/TaskToPortfolioIntro";
import TaskToPortfolioFailure from "../components/task-actions/task-to-portfolio/TaskToPortfolioFailure";
import TaskToPortfolioTitle from "../components/task-actions/task-to-portfolio/TaskToPortfolioTitle";
// import TaskToPortfolioWorkDetails from "../components/task-actions/task-to-portfolio/TaskToPortfolioWorkDetails";
import TaskToPortfolioDescription from "../components/task-actions/task-to-portfolio/TaskToPortfolioDescription";
// import TaskToPortfolioResultLink from "../components/task-actions/task-to-portfolio/TaskToPortfolioResultLink";
import TaskToPortfolioPreview from "../components/task-actions/task-to-portfolio/TaskToPortfolioPreview";
import TaskToPortfolioFullImage from "../components/task-actions/task-to-portfolio/TaskToPortfolioFullImage";
import Wizard from "../components/Wizard";

import taskListIcon from "../assets/img/icon-list.svg";

const TaskToPortfolio: React.FunctionComponent = (): ReactElement => {
  const [isPreventReset, setIsPreventReset] = useState(false);
  const { step, formData, doer, task, isNeedReset, createdPortfolioItemSlug } = useStoreState(
    state => state.components.taskToPortfolioWizard
  );
  const {
    setStep,
    setFormData,
    loadWizardData,
    saveWizardData,
    newPortfolioItemRequest,
    resetFormData,
    resetStep,
    setNeedReset,
  } = useStoreActions(actions => actions.components.taskToPortfolioWizard);

  useEffect(() => {
    loadWizardData();
  }, []);

  useEffect(() => {

    if (!isNeedReset || isPreventReset) {
      return;
    }

    resetFormData();
    resetStep();
    saveWizardData();
    setNeedReset(false);

  }, [isNeedReset, isPreventReset]);

  useEffect(() => {

    if(!createdPortfolioItemSlug) {
      return;
    }

    if(!doer.name) {
      return;
    }

    Router.push("/members/[username]/[portfolio_item_slug]", "/members/" + doer.slug + "/" + createdPortfolioItemSlug);

  }, [createdPortfolioItemSlug]);

  function handleCompleteWizard() {
    const { title, description, resultLink, workDetails, preview, fullImage } = formData as {
      title: string;
      description: string;
      resultLink?: string;
      workDetails?: string;
      preview?: number;
      fullImage?: number;
    };

    newPortfolioItemRequest({
      doer,
      task,
      title,
      description,
      resultLink,
      workDetails,
      preview: _.get(preview, "0.value", null), 
      fullImage: _.get(fullImage, "0.value", null), 
    });

    setIsPreventReset(true);
    setNeedReset(true);
    saveWizardData();
  }

  function handleCancelWizard(event) {
    event.preventDefault();

    setIsPreventReset(true);
    setNeedReset(true);

    Router.push("/tasks/[slug]", "/tasks/" + task.slug);
  }

  // console.log("task:", task);

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
        bottomBarTitle={task.title}
        bottomBarIcon={taskListIcon}
      >
        <TaskToPortfolioIntro isIgnoreStepNumber={true} />
        <TaskToPortfolioFailure isIgnoreStepNumber={true} />
        {/* <TaskToPortfolioWorkDetails /> */}
        <TaskToPortfolioTitle />
        <TaskToPortfolioDescription />
        {/* <TaskToPortfolioResultLink /> */}
        <TaskToPortfolioPreview shortTitle="Превью" />
        <TaskToPortfolioFullImage shortTitle="Фото" />
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
