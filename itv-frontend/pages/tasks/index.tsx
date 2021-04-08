import { ReactElement, useEffect, memo } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useStoreActions } from "../../model/helpers/hooks";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import TaskListStats from "../../components/task-list/TaskListStats";
import TaskList from "../../components/task-list/TaskList";
import TaskListFilter from "../../components/task-list/TaskListFilter";
import { ITaskListModel } from "../../model/model.typing";
import { taskListLimit } from "../../model/task-model/task-list-model";
// import * as utils from "../../utilities/utilities";
import { regEvent } from "../../utilities/ga-events";

const TaskListPage: React.FunctionComponent<ITaskListModel> = (): ReactElement => {
  const router = useRouter();
  const setCrumbs = useStoreActions(actions => actions.components.breadCrumbs.setCrumbs);

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  useEffect(() => {
    setCrumbs([
      {title: "Задачи", url: "/tasks"},
    ]);  
  }, []);

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
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `tasks`,
        seo: {
          canonical: `${process.env.BaseUrl}/tasks`,
          title: `Задачи - it-волонтер`,
          metaRobotsNoindex: "index",
          metaRobotsNofollow: "follow",
          opengraphTitle: "Задачи - it-волонтер",
          opengraphUrl: "https://itv.te-st.ru/tasks",
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      try {
        const { tasks: items } = await (await fetch(`${process.env.BaseUrl}/api/v1/cache/tasks?limit=${taskListLimit}`)).json();

        return ["taskList", { items }];
      } catch (error) {
        console.error("Failed to fetch the task list.");
      }
      
      return ["taskList", { items: [] }];
    },
  });

  return {
    props: { ...model },
  };
};

export default memo(TaskListPage);
