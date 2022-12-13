import { ReactElement, memo, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import NewsList from "../components/news/NewsList";
import { regEvent } from "../utilities/ga-events";

const NewsListPage: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const newsList = useStoreState(state => state.components.newsList);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreNewsRequest = useStoreActions(
    actions => actions.components.newsList.loadMoreNewsRequest
  );

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  async function handleLoadMoreNews(e) {
    e.preventDefault();
    setIsLoading(true);
    await loadMoreNewsRequest();
    setIsLoading(false);
  }

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main news-list-page" role="main">
          <article className="article-page">
            <div className="article-page__content">
              <h1 className="article-page__title">Новости</h1>
              <NewsList {...newsList} />
              {isLoading && (
                <div className="news-loading">
                  <div className="spinner-border" role="status"></div>
                </div>
              )}
              {!isLoading && newsList.hasNextPage && (
                <div className="load-more-news">
                  <a href="#" onClick={handleLoadMoreNews}>
                    Загрузить ещё
                  </a>
                </div>
              )}
            </div>
          </article>
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );

  const entrypointModel = {
    slug: "news",
    seo: {
      canonical: "https://itvist.org/news",
      title: "Новости - it-волонтер",
      metaRobotsNoindex: "noindex",
      metaRobotsNofollow: "nofollow",
      opengraphTitle: "Новости - it-волонтер",
      opengraphUrl: "https://itvist.org/news",
      opengraphSiteName: "it-волонтер",
    },
  };

  const model = await withAppAndEntrypointModel({
    isArchive: true,
    entrypointType: "post",
    entrypointQueryVars: {
      first: 20,
      after: null,
    },
    componentModel: async (request, componentData) => {
      return ["newsList", componentData];
    },
  });

  return {
    props: {
      ...model,
      ...{
        entrypoint: {
          ...model.entrypoint,
          ...{ archive: { ...model.entrypoint.archive, ...entrypointModel } },
        },
      },
    },
  };
};

export default memo(NewsListPage);
