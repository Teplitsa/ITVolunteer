import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../../components/DocumentHead";
import Main from "../../../../components/layout/Main";
import EditPortfolioItem from "../../../../components/page/EditPortfolioItem";

const PortfolioItemPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <EditPortfolioItem />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `https://itv.te-st.ru/members/${query.username}/${query.portfolio_item_slug}/edit`,
        seo: {
          canonical: `https://itv.te-st.ru/members/${query.username}/${query.portfolio_item_slug}/edit`,
          title: `Редактирование работы в портфолио - it-волонтер`,
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: `Редактирование работы в портфолио - it-волонтер`,
          opengraphUrl: `https://itv.te-st.ru/members/${query.username}/${query.portfolio_item_slug}/edit`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      return ["editPortfolioItem", {}];
    },
  });

  return {
    props: { ...model },
  };
};

export default PortfolioItemPage;
