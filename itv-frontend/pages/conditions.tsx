import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Page from "../components/page/Page";

const ConditionsPage: React.FunctionComponent = (): ReactElement => {
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
  const url: string = "/conditions";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "conditions" },
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

export default ConditionsPage;
