import { ReactElement } from "react";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Error403 from "../../components/page/Error403";
import { GetServerSideProps } from "next";

const TaskUpdateRoot: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <Error403 />
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 403;

  return {
    props: {
      app: {
        componentsLoaded: [],
        entrypointTemplate: "page",
      },
      entrypoint: {
        archive: null,
        page: {
          title: "Доступ запрещен - it-волонтер",
          seo: {
            canonical: "https://itv.te-st.ru/task-update",
            title: "Доступ запрещен - it-волонтер",
            metaRobotsNoindex: "noindex",
            metaRobotsNofollow: "nofollow",
            opengraphTitle: "Доступ запрещен - it-волонтер",
            opengraphUrl: "https://itv.te-st.ru/task-update",
            opengraphSiteName: "it-волонтер",
          },
        },
      },
    },
  };
};

export default TaskUpdateRoot;
