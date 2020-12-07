import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import AddPortfolioItem from "../../../components/page/AddPortfolioItem";

const AddPortfolioItemPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <AddPortfolioItem />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `members/${query.username}/portfolio/add-portfolio-item`,
        seo: {
          canonical: `https://itv.te-st.ru/members/${query.username}/add-portfolio-item`,
          title: `Добавление работы в портфолио - it-волонтер`,
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: `Добавление работы в портфолио - it-волонтер`,
          opengraphUrl: `https://itv.te-st.ru/members/${query.username}/add-portfolio-item`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      return ["addPortfolioItem", { username: query.username }];
    },
  });

  return {
    props: { ...model },
  };
};

export default AddPortfolioItemPage;
