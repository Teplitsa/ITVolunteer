import { ReactElement, useEffect, useState, ChangeEvent, } from "react";
import { GetServerSideProps } from "next";

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";

const ResetPasswordSuccessPage: React.FunctionComponent = (): ReactElement => {

  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main reset-password-success-page" role="main">
          <div className="auth-page__content">
            <div className="auth-page__ornament-container">
              <h1 className="auth-page__title">Вам отправлено письмо со ссылкой для подтверждения.</h1>
              <p className="auth-page__subtitle">
                Если не находите его, загляните в папку Спам, возможно, оно туда попало по ошибке
              </p>
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

export default ResetPasswordSuccessPage