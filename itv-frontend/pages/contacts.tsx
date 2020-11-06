import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import PageContacts from "../components/page/Contacts";

const ContactsPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main contacts-page" role="main">
          <PageContacts />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const url = "/contacts";
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "contacts" },
    entrypointType: "page",
    componentModel: async request => {
      const pageModel = await import("../model/page-model");
      const pageQuery = pageModel.graphqlQuery.getPageBySlug;
      const { pageBy: component } = await request(process.env.GraphQLServer, pageQuery, {
        uri: url,
      });

      return ["page", component];
    },
  });

  return {
    props: { ...model },
  };
};

export default ContactsPage;
