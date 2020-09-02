import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../components/DocumentHead";
import Main from "../../components/layout/Main";
import Members from "../../components/page/Members";
import { IMembersPageState } from "../../model/model.typing";

const MembersPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <Members />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `members`,
        seo: {
          canonical: `https://itv.te-st.ru/members`,
          title: `Участники - it-волонтер`,
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: `Участники - it-волонтер`,
          opengraphUrl: `https://itv.te-st.ru/members`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async (request) => {
      const {
        membersPageState,
        graphqlQuery: membersGraphqlQuery,
      } = await import("../../model/components/members-model");

      const response: IMembersPageState = await request(
        process.env.GraphQLServer,
        membersGraphqlQuery,
        {
          paged: membersPageState.paged,
        }
      );

      return ["members", { ...membersPageState, ...response }];
    },
  });

  return {
    props: { ...model },
  };
};

export default MembersPage;
