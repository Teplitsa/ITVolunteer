import { ReactElement, memo } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import TaskListStats from "../../components/task-list/TaskListStats";
import TaskList from "../../components/task-list/TaskList";
import TaskListFilter from "../../components/task-list/TaskListFilter";
import { ITaskListModel } from "../../model/model.typing";

const TaskListPage: React.FunctionComponent<ITaskListModel> = (
  taskList
): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main page-task-list" role="main">
          <section className="page-header">
            <h1>Задачи</h1>
            <TaskListStats />
          </section>
          <div className="page-sections">
            <TaskListFilter />
            <TaskList />
          </div>
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );

  const model = await withAppAndEntrypointModel({
    isArchive: true,
    entrypointType: "task",
    entrypointQueryVars: {
      first: 10,
      after: null,
    },
    componentModel: async (request, componentData) => {
      return ["taskList", componentData];
    },
  });

  return {
    props: { ...model },
  };
};

export default memo(TaskListPage);
