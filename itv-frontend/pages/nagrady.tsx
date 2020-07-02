import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Honors from "../components/page/Honors";

const PasekaPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <Honors />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/nagrady";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "nagrady" },
    entrypointType: "page",
    componentModel: async (request) => {
      const honorsPageModel = await import("../model/components/honors-model");
      const honorsPageQuery = honorsPageModel.graphqlQuery;
      const { pageBy: component } = await request(
        process.env.GraphQLServer,
        honorsPageQuery,
        { uri: url }
      );
      return ["honors", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default PasekaPage;
