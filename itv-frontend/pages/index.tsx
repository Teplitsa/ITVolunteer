import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { useStoreState } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Home from "../components/page/Home";
import * as utils from "../utilities/utilities";

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

const fetchTasksList = async () => {
  let action = 'get-task-list'  
  let res = await fetch(utils.getAjaxUrl(action), {
    method: 'post',
  })

  try {
    let result = await res.json()
    return result.taskList      
  } catch(ex) {
    console.log("fetch task list failed")
    return []
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

      const archiveModel = await import("../model/archive-model");
      const newsQuery = archiveModel.graphqlQuery.getPosts;
      const { posts: archive } = await request(
        process.env.GraphQLServer,
        newsQuery,
        {first: 2, after: null,}
      );
      const news = archive.edges.map(item => item.node);

      const tasks = await fetchTasksList();

      return ["homePage", {...component, taskList: tasks, newsList: news}];
    },
  });

  return {
    props: { ...model },
  };
};

export default HomePage;
