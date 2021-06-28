import { NextPage, NextPageContext } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Error404 from "../components/page/Error404";
import Error50X from "../components/page/Error50X";

const Error: NextPage<{ statusCode: number }> = ({ statusCode }) => {
  return (
    <>
      <DocumentHead />
      <Main>{statusCode === 404 ? <Error404 /> : <Error50X statusCode={statusCode} />}</Main>
    </>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  let entrypointModel;

  if (statusCode === 404) {
    entrypointModel = {
      title: "Сраница не найдена - it-волонтер",
      seo: {
        title: "Сраница не найдена - it-волонтер",
        metaRobotsNoindex: "noindex",
        metaRobotsNofollow: "nofollow",
        opengraphTitle: "Сраница не найдена - it-волонтер",
        opengraphSiteName: "it-волонтер",
      },
    };
  } else {
    entrypointModel = {
      title: "Что-то пошло не так - it-волонтер",
      seo: {
        title: "Что-то пошло не так - it-волонтер",
        metaRobotsNoindex: "noindex",
        metaRobotsNofollow: "nofollow",
        opengraphTitle: "Что-то пошло не так - it-волонтер",
        opengraphSiteName: "it-волонтер",
      },
    };
  }

  return {
    statusCode,
    app: {
      componentsLoaded: [],
      entrypointTemplate: "page",
      now: Date.now(),
    },
    entrypoint: { archive: null, page: entrypointModel },
  };
};

export default Error;
