import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Error401 from "../components/page/Error401";
import ManageTask from "../components/task-actions/manage-task/ManageTask";
import GlobalScripts, { ISnackbarMessage } from "../context/global-scripts";

const { SnackbarContext } = GlobalScripts;

const TaskCreatePage: React.FunctionComponent<{ statusCode?: number }> = ({
  statusCode,
}): ReactElement => {
  if (statusCode === 401) {
    return (
      <>
        <DocumentHead />
        <Main>
          <Error401 />
        </Main>
      </>
    );
  }

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <SnackbarContext.Consumer>
            {({ dispatch }) => {
              const addSnackbar = (message: ISnackbarMessage) => {
                dispatch({ type: "add", payload: { messages: [message] } });
              };
              const clearSnackbar = () => {
                dispatch({ type: "clear" });
              };
              return <ManageTask {...{ addSnackbar, clearSnackbar }} />;
            }}
          </SnackbarContext.Consumer>
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const loggedIn = decodeURIComponent(req.headers.cookie).match(
    /wordpress_logged_in_[^=]+=([^|]+)/
  );

  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: "task-create",
        seo: {
          canonical: "https://itv.te-st.ru/task-create",
          title: "Создание задачи - IT-волонтер",
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: "Создание задачи - IT-волонтер",
          opengraphUrl: "https://itv.te-st.ru/task-create",
          opengraphSiteName: "IT-волонтер",
        },
      },
    ],
    componentModel: async () => {
      if (!loggedIn) res.statusCode = 401;

      return ["manageTask", null];
    },
  });

  return {
    props: { statusCode: res.statusCode, ...model },
  };
};

export default TaskCreatePage;
