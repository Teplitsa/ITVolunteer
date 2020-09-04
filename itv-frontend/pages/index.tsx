import { ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import FormData from 'form-data';
import { request } from 'graphql-request';
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import { INewsListModel, IHomePageState } from "../model/model.typing";
import * as archiveModel from "../model/archive-model"

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Home from "../components/page/Home";
import * as utils from "../utilities/utilities";

const HomePage: React.FunctionComponent = (): ReactElement => {
  const loadStatsRequest = useStoreActions((actions) => actions.components.homePage.loadStatsRequest);
  const setNewsList = useStoreActions((actions) => actions.components.homePage.setNewsList);
  const setTaskList = useStoreActions((actions) => actions.components.homePage.setTaskList);

  useEffect(() => {
    loadTaskList();
    loadNews();
    loadStatsRequest();
  }, []);

  async function loadTaskList() {
    const tasks = await fetchTasksList();
    setTaskList(tasks);
  }

  async function loadNews() {
    const newsQuery = archiveModel.graphqlQuery.getPosts;
    const { posts: archive } = await request(
      process.env.GraphQLServer,
      newsQuery,
      {first: 2, after: null,}
    );
    const news = archive.edges.map(item => item.node);
    setNewsList(news);
  }

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

const fetchTasksList = async () => {
  let action = 'get-task-list';

  const form = new FormData();
  form.append('limit', 10);  

  let res = await fetch(utils.getAjaxUrl(action), {
    method: 'post',
    body: form,
  });

  try {
    let result = await res.json();
    return result.taskList;
  } catch(ex) {
    console.log("fetch task list failed");
    return [];
  }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/home";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "home" },
    entrypointType: "page",
    componentModel: async (request) => {
      const pageModel = await import("../model/page-model");
      const pageQuery = pageModel.graphqlQuery.getPageBySlug;
      const { pageBy: component } = await request(
        process.env.GraphQLServer,
        pageQuery,
        { uri: url }
      );

      return ["homePage", {...component, taskList: [], newsList: {isNewsListLoaded: false, items: []} as INewsListModel}];
    },
  });

  return {
    props: { ...model },
  };
};

export default HomePage;
