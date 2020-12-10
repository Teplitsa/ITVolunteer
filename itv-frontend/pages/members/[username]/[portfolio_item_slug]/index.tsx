import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../../components/DocumentHead";
import Main from "../../../../components/layout/Main";
import PortfolioItem from "../../../../components/page/PortfolioItem";
import { getRestApiUrl, stripTags } from "../../../../utilities/utilities";

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
      const componentData = { slug: query.portfolio_item_slug };

      try {
        const result = await fetch(
          getRestApiUrl(`/wp/v2/portfolio_work/slug:${query.portfolio_item_slug}`)
        );

        const {
          id,
          slug,
          title: { rendered: title },
          content: { rendered: description },
          featured_media: preview,
          meta: { portfolio_image_id: fullImage },
          data,
        } = (await result.json()) as {
          id: number;
          slug: string;
          title: { rendered: string };
          content: { rendered: string };
          featured_media: number;
          meta: { portfolio_image_id: number };
          data?: { status: number };
        };

        if (data?.status && data.status !== 200) {
          console.error("При загрузке данных портфолио произошла ошибка.");
        } else {
          Object.assign(componentData, {
            item: {
              id,
              slug,
              title: stripTags(title).trim(),
              description: stripTags(description).trim(),
              preview,
              fullImage,
            },
          });
        }
      } catch (error) {
        console.error(error);
      }

      return ["memberPortfolioItem", componentData];
    },
  });

  return {
    props: { ...model },
  };
};

export default PortfolioItemPage;
