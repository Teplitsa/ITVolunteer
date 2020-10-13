import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import {useRouter} from 'next/router';

import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Registration from "../components/auth/Registration";
import GlobalScripts, { ISnackbarMessage } from "../context/global-scripts";
import SnackbarList from "../components/global-scripts/SnackbarList";
import { regEvent } from "../utilities/ga-events";

const { SnackbarContext } = GlobalScripts;

const RegistrationPage: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isLoaded } = useStoreState((state) => state.session);
  const router = useRouter();

  useEffect(() => {
    regEvent('ge_show_new_desing', router);
  }, [router.pathname]);  

  useEffect(() => {
    if(!isLoaded) {
      return
    }

    if(isLoggedIn) {
      router.push("/tasks/")
    }

  }, [isLoggedIn, isLoaded, router])

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
              return <Registration {...{ addSnackbar, clearSnackbar, deleteSnackbar }} />;
            }}
          </SnackbarContext.Consumer>
          
        </main>
      </Main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );
  const entrypointModel = {
    slug: "registration",
    title: 'Добро пожаловать - it-волонтер',
    seo: {
      canonical: "https://itv.te-st.ru/registration",
      title: "Добро пожаловать - it-волонтер",
      metaRobotsNoindex: "noindex",
      metaRobotsNofollow: "nofollow",
      opengraphTitle: "Добро пожаловать - it-волонтер",
      opengraphUrl: "https://itv.te-st.ru/registration",
      opengraphSiteName: "it-волонтер",
    },
  };

  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "registration" },
    entrypointType: "page",
    componentModel: async (request) => {
      return ["page", {}];
    },
  });

  return {
    props: { ...model, ...{entrypoint: {...model.entrypoint, ...{page: entrypointModel}}} },
  };
};

export default RegistrationPage;
