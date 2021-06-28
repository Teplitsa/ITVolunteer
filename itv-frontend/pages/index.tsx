import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { authorizeSessionSSRFromRequest } from "../model/session-model";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Home from "../components/page/Home";

const HomePage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main home-page" role="main">
          <Home />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await authorizeSessionSSRFromRequest(req, res);
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: "home",
        seo: {
          canonical: "https://itv.te-st.ru",
          title: "it-волонтер. ИТ-помощь для благотворительных проектов",
          metaDesc:
            "Платформа помощи благотворительным организациям и активистам в области ИТ. Здесь вы можете попросить о помощи или предложить свои услуги.",
          focuskw: "it-волонтер - Сообщество",
          metaRobotsNoindex: "index",
          metaRobotsNofollow: "follow",
          opengraphAuthor: "",
          opengraphDescription:
            "Платформа помощи благотворительным организациям и активистам в области ИТ. Здесь вы можете попросить о помощи или предложить свои услуги.",
          opengraphTitle: "it-волонтер. ИТ-помощь для некоммерческих проектов",
          opengraphImage: {
            sourceUrl: "https://itv.te-st.ru/wp-content/uploads/2020/05/itv-export.png",
            srcSet:
              "https://itv.te-st.ru/wp-content/uploads/2020/05/itv-export.png 500w, https://itv.te-st.ru/wp-content/uploads/2020/05/itv-export-150x150.png 150w, https://itv.te-st.ru/wp-content/uploads/2020/05/itv-export-180x180.png 180w",
            altText: "",
          },
          opengraphUrl: "https://itv.te-st.ru/",
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      const homePage = {
        template: "volunteer",
        memberList: null,
      };

      try {
        const { stats } = await (await fetch(`${process.env.BaseUrl}/api/v1/cache/stats`)).json();

        Object.assign(homePage, { stats });
      } catch (error) {
        console.error("Failed to fetch the stats.");
      }

      try {
        const { tasks } = await (
          await fetch(`${process.env.BaseUrl}/api/v1/cache/tasks?limit=6`)
        ).json();

        Object.assign(homePage, { taskList: tasks });
      } catch (error) {
        console.error("Failed to fetch the task list.");
      }

      try {
        const { advantages } = await (
          await fetch(`${process.env.BaseUrl}/api/v1/cache/advantages`)
        ).json();

        Object.assign(homePage, { advantageList: advantages });
      } catch (error) {
        console.error("Failed to fetch the advantage list.");
      }

      try {
        const { faqs } = await (await fetch(`${process.env.BaseUrl}/api/v1/cache/faqs`)).json();

        Object.assign(homePage, { faqList: faqs });
      } catch (error) {
        console.error("Failed to fetch the faq list.");
      }

      try {
        const { partners } = await (
          await fetch(`${process.env.BaseUrl}/api/v1/cache/partners`)
        ).json();

        Object.assign(homePage, { partnerList: partners });
      } catch (error) {
        console.error("Failed to fetch the partner list.");
      }

      try {
        const { reviews } = await (
          await fetch(`${process.env.BaseUrl}/api/v1/cache/reviews`)
        ).json();

        Object.assign(homePage, { reviewList: reviews });
      } catch (error) {
        console.error("Failed to fetch the review list.");
      }

      try {
        const { news } = await (
          await fetch(`${process.env.BaseUrl}/api/v1/cache/news?limit=3`)
        ).json();

        Object.assign(homePage, { newsList: news });
      } catch (error) {
        console.error("Failed to fetch the news list.");
      }

      return ["homePage", homePage];
    },
  });

  return {
    props: { ...model, session },
  };
};

export default HomePage;
