import { ReactElement, useState, useEffect, useRef } from "react";
import * as _ from "lodash";

const Error50X: React.FunctionComponent<{statusCode: Number;}> = ({statusCode}): ReactElement => {
 
  return (
    <main id="site-main" className="site-main error-page error-page-500" role="main">
    <div className="auth-page__content">
      <div className="auth-page__ornament-container">
        {!!statusCode 
          ? <h1 className="auth-page__title">{statusCode} ошибка</h1>
          : <h1 className="auth-page__title">Ошибка!</h1>
        }
        <p className="auth-page__subtitle">Что-то пошло не так...</p>
      </div>
    </div>
  </main>
);
};

export default Error50X;
