import { useStoreState } from "../model/helpers/hooks";

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Error404 from "../components/page/Error404";
import Error50X from "../components/page/Error50X";

function Error({statusCode}) {

  return (
    <>
      <DocumentHead />
      <Main>
          {statusCode === 404
            ? <Error404 />
            : <Error50X statusCode={statusCode} />
          }
      </Main>
    </>    
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  var entrypointModel;
  
  if(statusCode === 404) {
    entrypointModel = {
      title: 'Сраница не найдена - it-волонтер',
      seo: {
        // canonical: "https://itv.te-st.ru/",
        title: "Сраница не найдена - it-волонтер",
        metaRobotsNoindex: "noindex",
        metaRobotsNofollow: "nofollow",
        opengraphTitle: "Сраница не найдена - it-волонтер",
        // opengraphUrl: "https://itv.te-st.ru/",
        opengraphSiteName: "it-волонтер",
      },
    };
  }
  else {
    entrypointModel = {
      title: 'Что-то пошло не так - it-волонтер',
      seo: {
        // canonical: "https://itv.te-st.ru/",
        title: "Что-то пошло не так - it-волонтер",
        metaRobotsNoindex: "noindex",
        metaRobotsNofollow: "nofollow",
        opengraphTitle: "Что-то пошло не так - it-волонтер",
        // opengraphUrl: "https://itv.te-st.ru/",
        opengraphSiteName: "it-волонтер",
      },
    };
  }

  return { 
    statusCode, 
    app: {
      componentsLoaded: [],
      entrypointTemplate: "page",
    },
    entrypoint: { archive: null, page: entrypointModel },
  }

}

export default Error