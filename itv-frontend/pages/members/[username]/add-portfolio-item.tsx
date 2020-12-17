import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import AddPortfolioItem from "../../../components/page/AddPortfolioItem";
import Error401 from "../../../components/page/Error401";

const AddPortfolioItemPage: React.FunctionComponent<{ statusCode?: number }> = ({
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
          <AddPortfolioItem />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
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
      return ["portfolioItemForm", {}];
    },
  });

  const loggedIn = decodeURIComponent(req.headers.cookie).match(/wordpress_logged_in_[^=]+=([^|]+)/);

  if (loggedIn && (query.username as string).toLowerCase() === loggedIn[1].toLowerCase()) {
    return {
      props: { ...model },
    };
  } else {
    res.statusCode = 401;
    Object.assign(model, { statusCode: 401 });
  }
};

export default AddPortfolioItemPage;
