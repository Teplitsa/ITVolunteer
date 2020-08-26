import { ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { INewsItemState } from "../../model/model.typing";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import NewsItem from "../../components/news/NewsItem";

const NewsItemPage: React.FunctionComponent<INewsItemState> = (newsItem): ReactElement => {
  const loadOtherNewsRequest = useStoreActions((actions) => actions.components.otherNewsList.loadOtherNewsRequest);
  const otherNews = useStoreState((state) => state.components.otherNewsList);
  const newsItemState = useStoreState((state) => state.components.newsItem);
  const [isOtherNewsLoaded, setIsOtherNewsLoaded] = useState(false);

  useEffect(() => {
    loadOtherNewsRequest({excludeNewsItem: newsItemState});
  }, [newsItemState])

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main signle-news-page" role="main">
          <NewsItem />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { slug },
}) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { slug },
    entrypointType: "post",
    componentModel: async (request) => {
      const pageModel = await import("../../model/news-model/news-item-model");
      const pageQuery = pageModel.graphqlQuery.getBySlug;
      const { postBy: component } = await request(
        process.env.GraphQLServer,
        pageQuery,
        { slug: slug }
      );      

      return ["newsItem", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default NewsItemPage;
