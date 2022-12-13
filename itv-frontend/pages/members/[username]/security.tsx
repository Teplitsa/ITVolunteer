import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useStoreState } from "../../../model/helpers/hooks";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import EditMemberSecurity from "../../../components/page/EditMemberSecurity";
import GlobalScripts, { ISnackbarMessage } from "../../../context/global-scripts";
import { authorizeSessionSSRFromRequest } from "../../../model/session-model";

const { SnackbarContext } = GlobalScripts;

const SecurityPage: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isLoaded } = useStoreState(state => state.session);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isLoggedIn) {
      router.push("/tasks/");
    }
  }, [isLoggedIn, isLoaded, router]);

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main" role="main">
          <SnackbarContext.Consumer>
            {({ dispatch }) => {
              const addSnackbar = (message: ISnackbarMessage) => {
                dispatch({ type: "add", payload: { messages: [message] } });
              };
              const clearSnackbar = () => {
                dispatch({ type: "clear" });
              };
              const deleteSnackbar = (message: ISnackbarMessage) => {
                dispatch({ type: "delete", payload: { messages: [message] } });
              };
              return <EditMemberSecurity {...{ addSnackbar, clearSnackbar, deleteSnackbar }} />;
            }}
          </SnackbarContext.Consumer>
        </main>
      </Main>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
  const { default: withAppAndEntrypointModel } = await import(
    "../../../model/helpers/with-app-and-entrypoint-model"
  );

  const session = await authorizeSessionSSRFromRequest(req, res);

  const model = await withAppAndEntrypointModel({
    isCustomPage: true,
    entrypointType: "page",
    customPageModel: async () => [
      "page",
      {
        slug: `members/${query.username}/security`,
        seo: {
          canonical: `https://itivist.org/members/${query.username}/security`,
          title: "Управление аккаунтом - it-волонтер",
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: "Управление аккаунтом - it-волонтер",
          opengraphUrl: `https://itivist.org/members/${query.username}/security`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      const { memberSecurityPageState } = await import(
        "../../../model/components/member-security-model"
      );
      return ["memberSecurity", memberSecurityPageState];
    },
  });

  return {
    props: { ...model, session },
  };
};

export default SecurityPage;
