import { ReactElement, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useStoreActions } from "../../model/helpers/hooks";
import { ISnackbarMessage } from "../../context/global-scripts";

import { regEvent } from "../../utilities/ga-events";

import checkboxOn from "../../assets/img/auth-form-check-on.svg";
import checkboxOff from "../../assets/img/auth-form-check-off.svg";

const Login: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
  clearSnackbar: () => void;
  deleteSnackbar: (message: ISnackbarMessage) => void;
}> = ({ addSnackbar, clearSnackbar }): ReactElement => {
  const router = useRouter();
  const formRef = useRef(null);
  const userLogin = useStoreActions(actions => actions.session.userLogin);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  function toggleIsRememberMe() {
    setIsRememberMe(!isRememberMe);
  }

  function loginSuccessCallback() {
    // setIsLoading(false);
    router.push("/tasks");
  }

  function loginErrorCallback(message) {
    addSnackbar({
      context: "error",
      text: message,
    });
    setIsLoading(false);
  }

  function validateFormData(formData) {
    let isValid = true;
    clearSnackbar();

    if (!formData.get("login") || !formData.get("login").trim()) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите логин или e-mail",
      });
    }

    if (!formData.get("pass") || !formData.get("pass").trim()) {
      // console.log("invalid password!!!");
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите пароль",
      });
    }

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    regEvent("reg_login", router);

    if (!formRef) {
      return;
    }

    const fData = new FormData(formRef.current);
    if (isRememberMe) {
      fData.set("remember", "1");
    }
    setFormData(fData);

    if (validateFormData(fData)) {
      setIsLoading(true);
      userLogin({
        formData: fData,
        successCallbackFn: loginSuccessCallback,
        errorCallbackFn: loginErrorCallback,
      });
    }
  }

  return (
    <div className="auth-page__illustration-container">
      <div className="auth-page__content auth-page__registration">
        <h1 className="auth-page__title">Вход</h1>
        <p className="auth-page__subtitle">
          {router.query.passwordChanged && "Новый пароль вступил в силу."}
        </p>
        <div className="auth-page__ornament-container">
          {!!isLoading && (
            <div className="auth-page__loading">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          {!isLoading && (
            <form
              action=""
              method="post"
              className="auth-page-form"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Логин или e-mail</label>
                <input
                  className="form__control_input form__control_full-width auth-page-form__control-input"
                  type="text"
                  name="login"
                  maxLength={50}
                  placeholder=""
                  tabIndex={1}
                  defaultValue={formData ? formData.get("login") : ""}
                />
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  <span>Пароль</span>
                  <a href="/reset-password">Забыли пароль?</a>
                </label>
                <input
                  className="form__control_input form__control_full-width auth-page-form__control-input"
                  type="password"
                  name="pass"
                  maxLength={50}
                  placeholder=""
                  tabIndex={2}
                  autoComplete="new-password"
                  defaultValue={formData ? formData.get("pass") : ""}
                />
              </div>
              <div className="auth-page-form__group">
                <div className="auth-page-form__control-checkbox" onClick={toggleIsRememberMe}>
                  <img src={isRememberMe ? checkboxOn : checkboxOff} />
                  <label className="auth-page-form__label" htmlFor="agreeGetNews">
                    Запомнить меня
                  </label>
                </div>
              </div>
              <div className="auth-page-form__group">
                <button
                  type="submit"
                  className={`auth-page-form__control-submit`}
                  tabIndex={3}
                  onClick={handleSubmit}
                >
                  Войти
                </button>
              </div>
              <div className="auth-page-form__footer">
                <div className="auth-page__cta auth-page__cta_register">
                  У вас нет аккаунта?{" "}
                  <Link href="/registration">
                    <a className="auth-page__cta-control">Зарегистрируйтесь</a>
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
