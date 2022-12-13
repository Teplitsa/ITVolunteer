import { ReactElement } from "react";
import { GetServerSideProps } from "next";

import DocumentHead from "../components/DocumentHead";
import Main from "../components/layout/Main";
import ResetPassword from "../components/auth/ResetPassword";

const ResetPasswordPage: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <DocumentHead />
      <Main>
        <main id="site-main" className="site-main reset-password-page" role="main">
          <div className="auth-page__content">
            <div className="auth-page__ornament-container">
              <ResetPassword />
            </div>
          </div>
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
    title: "Сброс пароля - it-волонтер",
    seo: {
      canonical: "https://itvist.org/reset-password",
      title: "Сброс пароля - it-волонтер",
      metaRobotsNoindex: "noindex",
      metaRobotsNofollow: "nofollow",
      opengraphTitle: "Сброс пароля - it-волонтер",
      opengraphUrl: "https://itvist.org/reset-password",
      opengraphSiteName: "it-волонтер",
    },
  };

  const model = await withAppAndEntrypointModel({
    entrypointQueryVars: { uri: "reset-password" },
    entrypointType: "page",
    componentModel: async () => {
      return ["page", {}];
    },
  });

  return {
    props: { ...model, ...{ entrypoint: { ...model.entrypoint, ...{ page: entrypointModel } } } },
  };
};

export default ResetPasswordPage;
