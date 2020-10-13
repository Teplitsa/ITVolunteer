import { ReactElement, useEffect, useState, ChangeEvent, } from "react";
import { GetServerSideProps } from "next";
import {useRouter} from 'next/router'

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import SetPassword from "../components/auth/SetPassword";

const SetPasswordPage: React.FunctionComponent = (): ReactElement => {

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main reset-password-page" role="main">
          <div className="auth-page__content">
            <div className="auth-page__ornament-container">
              <SetPassword />
            </div>
          </div>
        </main>
      </Main>
    </>    
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { default: withAppAndEntrypointModel } = await import(
    "../model/helpers/with-app-and-entrypoint-model"
  );

  var entrypointModel = {
    title: 'Сброс пароля - it-волонтер',
    seo: {
      canonical: "https://itv.te-st.ru/reset-password",
      title: "Сброс пароля - it-волонтер",
      metaRobotsNoindex: "noindex",
      metaRobotsNofollow: "nofollow",
      opengraphTitle: "Сброс пароля - it-волонтер",
      opengraphUrl: "https://itv.te-st.ru/reset-password",
      opengraphSiteName: "it-волонтер",
    },
  };

  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "reset-password" },
    entrypointType: "page",
    componentModel: async (request) => {
      return ["page", {}];
    },
  });

  return {
    props: { ...model, ...{entrypoint: {...model.entrypoint, ...{page: entrypointModel}}} },
  };
};

export default SetPasswordPage