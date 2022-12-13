import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { useStoreState } from "../../../model/helpers/hooks";
import DocumentHead from "../../../components/DocumentHead";
import Main from "../../../components/layout/Main";
import EditMemberProfile from "../../../components/page/EditMemberProfile";
import GlobalScripts, { ISnackbarMessage } from "../../../context/global-scripts";
import { authorizeSessionSSRFromRequest } from "../../../model/session-model";

const { SnackbarContext } = GlobalScripts;

const ProfilePage: React.FunctionComponent = (): ReactElement => {
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
              return <EditMemberProfile {...{ addSnackbar, clearSnackbar, deleteSnackbar }} />;
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
        slug: `members/${query.username}/profile`,
        seo: {
          canonical: `https://itvist.org/members/${query.username}/profile`,
          title: "Данные профиля - it-волонтер",
          metaRobotsNoindex: "noindex",
          metaRobotsNofollow: "nofollow",
          opengraphTitle: "Данные профиля - it-волонтер",
          opengraphUrl: `https://itvist.org/members/${query.username}/profile`,
          opengraphSiteName: "it-волонтер",
        },
      },
    ],
    componentModel: async () => {
      const { memberProfilePageState } = await import(
        "../../../model/components/member-profile-model"
      );
      return ["memberProfile", memberProfilePageState];
    },
  });

  return {
    props: { ...model, session },
  };
};

export default ProfilePage;
