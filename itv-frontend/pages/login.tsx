import { ReactElement, useEffect } from "react";
import { GetServerSideProps } from "next";
import {useRouter} from 'next/router'

import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import Login from "../components/auth/Login";
import GlobalScripts, { ISnackbarMessage } from "../context/global-scripts";
import SnackbarList from "../components/global-scripts/SnackbarList";

const { SnackbarContext } = GlobalScripts;

const LoginPage: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isLoaded } = useStoreState((state) => state.session);
  const router = useRouter()

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
              return <Login {...{ addSnackbar, clearSnackbar, deleteSnackbar }} />;
            }}
          </SnackbarContext.Consumer>
          
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

export default LoginPage;
