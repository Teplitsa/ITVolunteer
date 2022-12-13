import { ReactElement, useEffect, memo } from "react";
import { GetServerSideProps } from "next";
import * as _ from "lodash";
import SsrCookie from "ssr-cookie";
import FormData from "form-data";
import { useStoreActions } from "../../model/helpers/hooks";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import TaskListStats from "../../components/task-list/TaskListStats";
import TaskList from "../../components/task-list/TaskList";
import TaskListFilter from "../../components/task-list/TaskListFilter";
import { ITaskListModel } from "../../model/model.typing";
import { authorizeSessionSSRFromRequest } from "../../model/session-model";
import { taskListLimit } from "../../model/task-model/task-list-model";
import * as utils from "../../utilities/utilities";

const TaskListPage: React.FunctionComponent<ITaskListModel> = (): ReactElement => {
  const setCrumbs = useStoreActions(actions => actions.components.breadCrumbs.setCrumbs);
  // const user = useStoreState(state => state.session.user);

  useEffect(() => {
    setCrumbs([{ title: "Задачи", url: "/tasks" }]);
  }, []);

  // console.log("session SSR user.slug:", user.slug);

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

const fetchTasksList = async checkedOptions => {
  const action = "get-task-list";

  const form = new FormData();
  form.append("limit", String(taskListLimit));
  form.append("filter", JSON.stringify(checkedOptions));

  const res = await fetch(utils.getAjaxUrl(action), {
    method: "post",
    body: form,
  });

  try {
    const result = await res.json();
    return result.taskList;
  } catch (ex) {
    console.log("fetch task list failed");
    return [];
  }
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );

  const cookieSSR = new SsrCookie(req, res);
  const session = await authorizeSessionSSRFromRequest(req, res);

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
          opengraphUrl: "https://itivist.org/tasks",
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      let items = [];

      let checkedOptions = cookieSSR.get("taskFilter.optionCheck");

      if (checkedOptions) {
        try {
          checkedOptions = JSON.parse(checkedOptions);
        } catch (ex) {
          checkedOptions = {};
        }
      } else {
        checkedOptions = {};
      }

      if (_.isEmpty(checkedOptions)) {
        try {
          // console.log("fetch tasks from mongo");
          ({ tasks: items } = await (
            await fetch(`${process.env.BaseUrl}/api/v1/cache/tasks?limit=${taskListLimit}`)
          ).json());
        } catch (error) {
          console.error("Failed to fetch the task list:", error);
        }
      } else {
        // console.log("fetch tasks from WP");
        items = await fetchTasksList(checkedOptions);
      }

      return ["taskList", { items }];
    },
  });

  return {
    props: { ...model, session },
  };
};

export default memo(TaskListPage);
