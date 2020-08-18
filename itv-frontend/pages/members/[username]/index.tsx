import { ReactElement } from "react";
import { GetServerSideProps } from "next";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import MemberAccount from "../../../components/page/MemberAccount";

const AccountPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />

      <Main>
        <main id="site-main" className="site-main" role="main">
          <MemberAccount />
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../../model/helpers/with-app-and-entrypoint-model"
  );
  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `members/${query.username}`,
        seo: {
          canonical: `https://itv.te-st.ru/members/${query.username}`,
          title: "Аккаунт - it-волонтер",
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: "Аккаунт - it-волонтер",
          opengraphUrl: `https://itv.te-st.ru/members/${query.username}`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      const { memberAccountPageState } = await import(
        "../../../model/components/member-account-model"
      );
      return ["memberAccount", memberAccountPageState];
    },
  });

  return {
    props: { ...model },
  };
};

export default AccountPage;
