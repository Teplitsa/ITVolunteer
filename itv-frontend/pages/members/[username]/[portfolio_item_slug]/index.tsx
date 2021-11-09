import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../../components/DocumentHead";
import Main from "../../../../components/layout/Main";
import PortfolioItem from "../../../../components/page/PortfolioItem";
import { getRestApiUrl, stripTags } from "../../../../utilities/utilities";
import { IRestApiResponse, IPortfolioItemAuthor } from "../../../../model/model.typing";
import with404 from "../../../../components/hoc/with404";
import { getMediaData } from "../../../../utilities/media";
import * as utils from "../../../../utilities/utilities";
import { authorizeSessionSSRFromRequest } from "../../../../model/session-model";

const PortfolioItemPage: React.FunctionComponent = (): ReactElement => {
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

const PortfolioItemPageWith404 = with404(PortfolioItemPage);

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../../../model/helpers/with-app-and-entrypoint-model"
  );

  const session = await authorizeSessionSSRFromRequest(req, res);

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
            "slug",
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
            "isPasekaMember",
            "partnerIcon",
          ]
            .map(paramValue => `_fields[]=${paramValue}`)
            .join("&");
        })();

        const portfolioItemAuthorResult = await utils.tokenFetch(
          portfolioItemAuthorRequestUrl.toString()
        );

        const response: IRestApiResponse & IPortfolioItemAuthor =
          await portfolioItemAuthorResult.json();

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
        const portfolioItemResult = await utils.tokenFetch(
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
            prev_work_slug: prevPortfolioItemSlug,
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
              description,
              preview,
              fullImage,
              nextPortfolioItemSlug,
              prevPortfolioItemSlug,
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
    props: { ...model, session },
  };
};

export default PortfolioItemPageWith404;
