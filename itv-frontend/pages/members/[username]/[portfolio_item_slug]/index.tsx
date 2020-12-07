import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../../components/DocumentHead";
import Main from "../../../../components/layout/Main";
import PortfolioItem from "../../../../components/page/PortfolioItem";

const PortfolioItemPage: React.FunctionComponent<any> = ({
  username,
  portfolioItemSlug,
}): ReactElement => {
  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <PortfolioItem {...{ username, portfolioItemSlug }} />
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
        slug: `members/${query.username}/${query.portfolio_item_slug}`,
        seo: {
          canonical: `https://itv.te-st.ru/members/${query.username}/portfolio/${query.portfolio_item_slug}`,
          title: `Портфолио участника ${query.username}: ${query.portfolio_item_slug} - it-волонтер`,
          metaRobotsNoindex: "index",
          metaRobotsNofollow: "follow",
          opengraphTitle: `Портфолио участника ${query.username}: ${query.portfolio_item_slug} - it-волонтер`,
          opengraphUrl: `https://itv.te-st.ru/members/${query.username}/portfolio/${query.portfolio_item_slug}`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      return [
        "memberPortfolioItem",
        { username: query.username, portfolioItemSlug: query.portfolio_item_slug },
      ];
    },
  });

  return {
    props: { ...model },
  };
};

export default PortfolioItemPage;
