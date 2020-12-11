import { ReactElement } from "react";
import Image404Man from "../../assets/img/illustration-404-man.svg";

const Error403: React.FunctionComponent = (): ReactElement => {
  return (
    <main id="site-main" className="site-main error-page error-page-404" role="main">
      <div className="auth-page__content">
        <h1 className="auth-page__title">403 ошибка</h1>
        <p className="auth-page__subtitle">
          Доступ к странице ограничен :(
          <br />У вас недостаточно прав!
        </p>
        <div className="auth-page__ornament-container">
          <div className="error-page-search-form-container">
            <img src={Image404Man} className="man-404" alt="Страница недоступна" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Error403;
