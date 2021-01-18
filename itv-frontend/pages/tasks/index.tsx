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
import * as utils from "../../utilities/utilities";
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

const fetchTasksList = async () => {
  const action = "get-task-list";
  const res = await fetch(utils.getAjaxUrl(action), {
    method: "post",
  });

  try {
    const result = await res.json();
    return result.taskList;
  } catch (ex) {
    console.log("fetch task list failed");
    return [];
  }
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
    componentModel: async () => {
      const items = await fetchTasksList();
      return ["taskList", { items: items }];
    },
  });

  return {
    props: { ...model },
  };
};

export default memo(TaskListPage);
