import { ReactElement, memo } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Task from "../../components/task/Task";
import TaskComments from "../../components/task/TaskComments";
import TaskSuggestionsForVolonteers from "../../components/task/TaskSuggestionsForVolonteers";
import TaskAuthor from "../../components/task/author/TaskAuthor";
import TaskApprovedDoer from "../../components/task/TaskApprovedDoer";
import TaskVolonteerFeedback from "../../components/task/TaskVolonteerFeedback";
import TaskAdminSupport from "../../components/task/TaskAdminSupport";
import Sidebar from "../../components/layout/partials/Sidebar";
import { ITaskState } from "../../model/model.typing";

const TaskPage: React.FunctionComponent<ITaskState> = (task): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main page-task" role="main">
          <section className="content">
            <h2>Задача</h2>
            <Task />
            <TaskComments />
            <TaskSuggestionsForVolonteers />
          </section>
          <Sidebar>
            <TaskAuthor />
            <TaskApprovedDoer />
            <TaskVolonteerFeedback />
            <TaskAdminSupport />
          </Sidebar>
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { slug },
}) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );

  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { slug },
    entrypointType: "task",
    componentModel: async (request) => {
      const taskModel = await import("../../model/task-model/task-model");
      const taskQuery = taskModel.graphqlQuery.getBySlug;
      const { task: component } = await request(
        process.env.GraphQLServer,
        taskQuery,
        { taskSlug: slug }
      );

      return ["task", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default memo(TaskPage);
