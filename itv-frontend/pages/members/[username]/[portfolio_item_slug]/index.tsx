import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../../components/DocumentHead";
import Main from "../../../../components/layout/Main";
import PortfolioItem from "../../../../components/page/PortfolioItem";
import { getRestApiUrl, stripTags } from "../../../../utilities/utilities";
import { IRestApiResponse, IPortfolioItemAuthor } from "../../../../model/model.typing";
import Error404 from "../../../../components/page/Error404";
import { getMediaData } from "../../../../utilities/media";

const PortfolioItemPage: React.FunctionComponent<{ statusCode?: number }> = ({
  statusCode,
}): ReactElement => {
  if (statusCode === 404) {
    return (
      <>
        <DocumentHead />
        <Main>
          <Error404 />
        </Main>
      </>
    );
  }

  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <PortfolioItem />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
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
      const componentData = {};

      try {
        const portfolioItemAuthorRequestUrl = new URL(
          getRestApiUrl(`/itv/v1/member/${query.username}`)
        );

        portfolioItemAuthorRequestUrl.search = (() => {
          return [
            "id",
            "name",
            "fullName",
            "authorReviewsCount",
            "doerReviewsCount",
            "reviewsCount",
            "rating",
            "xp",
            "itvRole",
            "itvRoleTitle",
            "itvAvatar",
          ]
            .map(paramValue => `_fields[]=${paramValue}`)
            .join("&");
        })();

        const portfolioItemAuthorResult = await fetch(portfolioItemAuthorRequestUrl.toString());

        const response: IRestApiResponse &
          IPortfolioItemAuthor = await portfolioItemAuthorResult.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error("При получении данных автора работы в портфолио произошла ошибка.");
        } else {
          Object.assign(componentData, {
            author: response,
          });
        }
      } catch (error) {
        console.error(error);
      }

      try {
        const portfolioItemResult = await fetch(
          getRestApiUrl(`/wp/v2/portfolio_work/slug:${query.portfolio_item_slug}`)
        );
        const response: IRestApiResponse & {
          id: number;
          slug: string;
          title: { rendered: string };
          content: { rendered: string };
          featured_media: number;
          meta: { portfolio_image_id: number };
          next_work_slug: string;
          prev_work_slug: string;
        } = await portfolioItemResult.json();

        if (response.data?.status && response.data.status !== 200) {
          console.error(
            `HTTP ${response.data.status} При загрузке данных портфолио произошла ошибка.`
          );
        } else {
          const {
            id,
            slug,
            title: { rendered: title },
            content: { rendered: description },
            featured_media: preview,
            meta: { portfolio_image_id },
            next_work_slug: nextPortfolioItemSlug,
            prev_work_slug: prevPortfolioItemSlug
          } = response;

          let fullImage: number | string = portfolio_image_id;

          if (fullImage !== 0) {
            const media = await getMediaData(fullImage);

            (media && (fullImage = media.mediaItemUrl)) || (fullImage = null);
          }

          Object.assign(componentData, {
            item: {
              id,
              slug,
              title: stripTags(title).trim(),
              description: stripTags(description).trim(),
              preview,
              fullImage,
              nextPortfolioItemSlug,
              prevPortfolioItemSlug
            },
          });
        }
      } catch (error) {
        console.error(error);
      }

      return ["portfolioItem", componentData];
    },
  });

  if (!model.portfolioItem.item?.id) {
    res.statusCode = 404;
    Object.assign(model, { statusCode: 404 });
  }

  return {
    props: { ...model },
  };
};

export default PortfolioItemPage;
