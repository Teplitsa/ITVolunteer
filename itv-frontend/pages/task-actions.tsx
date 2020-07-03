import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import { AgreementScreen, SetTaskTitleScreen, SetTaskDescriptionScreen } from "../components/task-actions/CreateTaskScreens";
import WizardScreen from "../components/layout/WizardScreen";
import Wizard from "../components/hoc/Wizard";

const CreateTask: React.FunctionComponent = (): ReactElement => {

  return (
    <>
      <DocumentHead />
      <Wizard component={WizardScreen}>
        <AgreementScreen />
        <SetTaskTitleScreen />
        <SetTaskDescriptionScreen />
      {/*
        <SetTaskResultScreen />
        <SetTaskImpactScreen />
        <SetTaskReferencesScreen />
        <SetTaskRemoteResourcesScreen />
        <UploadTaskFilesScreen />
        <SelectTaskCategoryScreen />
        <SelectTaskTagsScreen />
        <SelectTaskNgoTagsScreen />
        <SelectTaskPreferredDoerScreen />
        <SelectTaskRewardScreen />
        <SelectTaskPreferredDurationScreen />
        <SelectTaskPosterScreen />
      */}
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
