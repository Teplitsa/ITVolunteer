import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Registration from "../components/auth/Registration";

const RegistrationPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <Registration />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/paseka";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "paseka" },
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

export default RegistrationPage;
