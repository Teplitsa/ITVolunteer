import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import AccountActivated from "../components/auth/AccountActivated";

const AccountActivationCompletedPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <AccountActivated />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url: string = "/account-activation";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "account-activation" },
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

export default AccountActivationCompletedPage;
