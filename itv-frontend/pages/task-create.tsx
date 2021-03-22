import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import ManageTask from "../components/task-actions/manage-task/ManageTask";
import GlobalScripts, { ISnackbarMessage } from "../context/global-scripts";

const { SnackbarContext } = GlobalScripts;

const TaskCreatePage: React.FunctionComponent = (): ReactElement => {
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

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
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
          title: "Создание задачаи - IT-волонтер",
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: "Создание задачаи - IT-волонтер",
          opengraphUrl: "https://itv.te-st.ru/task-create",
          opengraphSiteName: "IT-волонтер",
        },
      },
    ],
    componentModel: async () => {
      return ["manageTask", null];
    },
  });

  return {
    props: { ...model },
  };
};

export default TaskCreatePage;
