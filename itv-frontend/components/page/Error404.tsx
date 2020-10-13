import { ReactElement, useState, useEffect, useRef } from "react";
import * as _ from "lodash";

import GlobalScripts, { ISnackbarMessage } from "../../context/global-scripts";
import HeaderSearch from "../layout/partials/HeaderSearch";

import Image404Man from "../../assets/img/illustration-404-man.svg";

const { SnackbarContext } = GlobalScripts;

const Error404: React.FunctionComponent = (): ReactElement => {
 
  return (
    <main id="site-main" className="site-main error-page error-page-404" role="main">
    <div className="auth-page__content">
      <h1 className="auth-page__title">404 ошибка</h1>
      <p className="auth-page__subtitle">Мы не смогли найти такую страницу :(<br />Но, возможно, наш поиск поможет вам это сделать!</p>
      <div className="auth-page__ornament-container">
        <div className="error-page-search-form-container">

          <SnackbarContext.Consumer>
            {({ dispatch }) => {
              const addSnackbar = (message: ISnackbarMessage) => {
                dispatch({ type: "add", payload: { messages: [message] } });
              };
              return (
                <div className="error-page-search-form">
                  <HeaderSearch
                    {...{
                      addSnackbar,
                      isOpen: true,
                      setOpen: () => {},
                      isCleanOnCrossClick: true,
                      submitButton: <input className="btn btn_primary" type="submit" value="Найти" />
                    }}
                  />
                </div>
              );
            }}
          </SnackbarContext.Consumer>

          <img
            src={Image404Man}
            className="man-404"
            alt="Страница не найдена"
          />

        </div>
      </div>
    </div>
  </main>
);
};

export default Error404;
