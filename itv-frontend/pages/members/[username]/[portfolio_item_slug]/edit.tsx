import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../../components/DocumentHead";
import Main from "../../../../components/layout/Main";
import EditPortfolioItem from "../../../../components/page/EditPortfolioItem";
import Error401 from "../../../../components/page/Error401";
import { getRestApiUrl, stripTags } from "../../../../utilities/utilities";

const PortfolioItemPage: React.FunctionComponent<{ statusCode?: number }> = ({
  statusCode,
}): ReactElement => {
  if (statusCode === 401) {
    return (
      <>
        <DocumentHead />
        <Main>
          <Error401 />
        </Main>
      </>
    );
  }

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

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
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
      const componentData = { slug: query.portfolio_item_slug };

      try {
        const result = await fetch(
          getRestApiUrl(`/wp/v2/portfolio_work/slug:${query.portfolio_item_slug}`)
        );

        const {
          id,
          title: { rendered: title },
          content: { rendered: description },
          featured_media: preview,
          meta: { portfolio_image_id: fullImage },
          data,
        } = (await result.json()) as {
          id: number;
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
            id,
            title: stripTags(title).trim(),
            description: stripTags(description).trim(),
            preview,
            fullImage,
          });
        }
      } catch (error) {
        console.error(error);
      }

      return ["portfolioItemForm", componentData];
    },
  });

  const loggedIn = decodeURIComponent(req.headers.cookie).match(/_logged_in_[^=]+=([^|]+)/);

  if (!loggedIn || query.username !== loggedIn[1]) {
    res.statusCode = 401;
    Object.assign(model, { statusCode: 401 });
  }

  return {
    props: { ...model },
  };
};

export default PortfolioItemPage;
