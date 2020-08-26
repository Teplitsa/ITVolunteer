import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Paseka from "../components/page/Paseka";

const PasekaPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <Paseka />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/about-paseka";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "about-paseka" },
    entrypointType: "page",
    componentModel: async (request) => {
      const pasekaPageModel = await import("../model/components/paseka-model");
      const pasekaPageQuery = pasekaPageModel.graphqlQuery;
      const { pageBy: component } = await request(
        process.env.GraphQLServer,
        pasekaPageQuery,
        { uri: url }
      );

      return ["paseka", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default PasekaPage;
