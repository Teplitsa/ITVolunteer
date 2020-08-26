import { ReactElement, memo, useState } from "react";
import { GetServerSideProps } from "next";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import NewsList from "../components/news/NewsList";
import { INewsListModel } from "../model/model.typing";
import * as utils from "../utilities/utilities";

const NewsListPage: React.FunctionComponent = (): ReactElement => {
  const newsList = useStoreState((state) => state.components.newsList);
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreNewsRequest = useStoreActions((actions) => actions.components.newsList.loadMoreNewsRequest)

  async function handleLoadMoreNews(e) {
    e.preventDefault();
    setIsLoading(true);
    console.log("load more news");
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
              <h1
                className="article-page__title"
              >Новости</h1>
              <NewsList {...newsList} />
              {isLoading && (
                <div className="news-loading">
                  <div className="spinner-border" role="status"></div>
                </div>)     
              }
              {!isLoading && newsList.hasNextPage && 
              <div className="load-more-news">
                <a href="#" onClick={handleLoadMoreNews}>Загрузить ещё</a>
              </div>
              }
            </div>
          </article>
        </main>
      </Main>
    </>
  );
};

const fetchNewsList = async () => {
  let action = 'get-news-list'  
  let res = await fetch(utils.getAjaxUrl(action), {
    method: 'post',
  })

  try {
    let result = await res.json()
    return result.newsList      
  } catch(ex) {
    console.log("fetch news list failed")
    return []
  }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );

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
    props: { ...model },
  };
};

export default memo(NewsListPage);
