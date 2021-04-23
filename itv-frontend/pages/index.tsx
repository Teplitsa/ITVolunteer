import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import FormData from "form-data";
import { request } from "graphql-request";
import { useStoreActions } from "../model/helpers/hooks";
import { INewsListModel } from "../model/model.typing";
import * as archiveModel from "../model/archive-model";

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Home from "../components/page/Home";
import * as utils from "../utilities/utilities";

const HomePage: React.FunctionComponent = (): ReactElement => {
  const loadStatsRequest = useStoreActions(actions => actions.components.homePage.loadStatsRequest);
  // const setNewsList = useStoreActions(actions => actions.components.homePage.setNewsList);
  // const setTaskList = useStoreActions(actions => actions.components.homePage.setTaskList);

  useEffect(() => {
    // loadTaskList();
    // loadNews();
    loadStatsRequest();
  }, []);

  // async function loadTaskList() {
  //   const tasks = await fetchTasksList();
  //   setTaskList(tasks);
  // }

  // async function loadNews() {
  //   const newsQuery = archiveModel.graphqlQuery.getPosts;
  //   const { posts: archive } = await request(process.env.GraphQLServer, newsQuery, {
  //     first: 2,
  //     after: null,
  //   });
  //   const news = archive.edges.map(item => item.node);
  //   setNewsList(news);
  // }

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

// const fetchTasksList = async () => {
//   const action = "get-task-list";

//   const form = new FormData();
//   form.append("limit", 10);

//   const res = await fetch(utils.getAjaxUrl(action), {
//     method: "post",
//     body: form,
//   });

//   try {
//     const result = await res.json();
//     return result.taskList;
//   } catch (ex) {
//     console.log("fetch task list failed");
//     return [];
//   }
// };

export const getServerSideProps: GetServerSideProps = async () => {
  const url = "/home";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "home" },
    entrypointType: "page",
    componentModel: async request => {
      const pageModel = await import("../model/page-model");
      const pageQuery = pageModel.graphqlQuery.getPageBySlug;
      const { pageBy: component } = await request(process.env.GraphQLServer, pageQuery, {
        uri: url,
      });
      const homePage = {
        ...component,
        template: "volunteer",
        memberList: null,
      };

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
    props: { ...model },
  };
};

export default HomePage;
