import { ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Router from "next/router";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import TaskToPortfolioIntro from "../components/task-actions/task-to-portfolio/TaskToPortfolioIntro";
import TaskToPortfolioFailure from "../components/task-actions/task-to-portfolio/TaskToPortfolioFailure";
import TaskToPortfolioTitle from "../components/task-actions/task-to-portfolio/TaskToPortfolioTitle";
import TaskToPortfolioDescription from "../components/task-actions/task-to-portfolio/TaskToPortfolioDescription";
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
    if(!task) {
      return;
    }

    if(formData.title || !task.title) {
      return;
    }

    setFormData({...formData, title: task.title});
  }, [task, formData]);

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
    const { title, description, preview, fullImage } = formData as {
      title: string;
      description: string;
      preview?: number;
      fullImage?: number;
    };

    newPortfolioItemRequest({
      doer,
      task,
      title,
      description,
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
        <TaskToPortfolioTitle />
        <TaskToPortfolioDescription />
        <TaskToPortfolioPreview shortTitle="Превью" description="Перетащите файлы в выделенную область для загрузки или кликните на кнопку “Загрузить”. Оптимальный размер картинки для превью 320x200." />
        <TaskToPortfolioFullImage shortTitle="Фото"  description="Перетащите файлы в выделенную область для загрузки или кликните на кнопку “Загрузить”. Оптимальная ширина основной картинки 1140px." />
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
