import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import { useStoreState } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Page from "../components/page/Page";

const AboutPage: React.FunctionComponent = (): ReactElement => {
  const state = useStoreState((state) => state);
  console.log("AboutPage page:", state.components.page);
  // console.log("AboutPage entrypoint:", state.entrypoint);

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <Page />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/about";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "about" },
    entrypointType: "page",
    componentModel: async (request) => {
      const pageModel = await import("../model/page-model");
      const pageQuery = pageModel.graphqlQuery.getPageBySlug;
      const { pageBy: component } = await request(
        process.env.GraphQLServer,
        pageQuery,
        { uri: url }
      );

      return ["page", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default AboutPage;
