import { ReactElement, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useStoreActions } from "../../model/helpers/hooks";
import { ISnackbarMessage } from "../../context/global-scripts";

import { regEvent } from "../../utilities/ga-events";

import checkboxOn from "../../assets/img/auth-form-check-on.svg";
import checkboxOff from "../../assets/img/auth-form-check-off.svg";

const Registration: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
  clearSnackbar: () => void;
  deleteSnackbar: (message: ISnackbarMessage) => void;
}> = ({ addSnackbar, clearSnackbar }): ReactElement => {
  // const { title, content } = useStoreState((state) => state.components.paseka);
  const router = useRouter();
  const formRef = useRef(null);
  const register = useStoreActions(actions => actions.session.register);
  const [isAgree, setIsAgree] = useState({ pd: false, mailing: false });
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);
  const [registrationSuccessText, setRegistrationSuccessText] = useState("");
  const [isRegistrationLoading, setIsRegistrationLoading] = useState(false);
  const [regFormData, setRegFormData] = useState(null);

  useEffect(() => {
    let allowed = true;
    for (const k in isAgree) {
      if (k === "mailing") {
        continue;
      }

      allowed = allowed && !!isAgree[k];
    }
    setIsSubmitAllowed(allowed);
  }, [isAgree]);

  function toggleAgree(agreeName) {
    setIsAgree({ ...isAgree, ...{ [agreeName]: !isAgree[agreeName] } });
  }

  function registrationSuccessCallback(message) {
    setRegistrationSuccessText(message);
    setIsRegistrationLoading(false);
  }

  function registrationErrorCallback(message) {
    addSnackbar({
      context: "error",
      text: message,
    });
    setIsRegistrationLoading(false);
  }

  function validateFormData(formData) {
    let isValid = true;
    clearSnackbar();

    if (!formData.get("first_name") || !formData.get("first_name").trim()) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите имя",
      });
    }

    if (!formData.get("last_name") || !formData.get("last_name").trim()) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите фамилию",
      });
    }

    if (!formData.get("email") || !formRef.current.elements["email"]?.checkValidity()) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите корректный email",
      });
    }

    console.log("form:", [...formData.entries()]);
    console.log("pass:", formData.get("pass"));

    if (!formData.get("pass") || !formData.get("pass").trim()) {
      console.log("invalid password!!!");
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите пароль",
      });
    } else if (formData.get("pass") != formData.get("passRepeat")) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Пароли не совпадают",
      });
    }

    return isValid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formRef) {
      return;
    }

    if (!isSubmitAllowed) {
      return;
    }

    regEvent("reg_reg", router);

    const formData = new FormData(formRef.current);
    setRegFormData(formData);

    if (validateFormData(formData)) {
      setIsRegistrationLoading(true);
      register({
        formData,
        successCallbackFn: registrationSuccessCallback,
        errorCallbackFn: registrationErrorCallback,
      });
    }
  }

  return (
    <div className="auth-page__illustration-container">
      <div className="auth-page__content auth-page__registration">
        <h1 className="auth-page__title">Регистрация</h1>
        {(!registrationSuccessText || isRegistrationLoading) && (
          <p className="auth-page__subtitle">
            IT-волонтёр – решение простых социальных задач, которые дают вам дополнительный опыт и
            хорошо смотрятся в портфолио! Вы можете помочь?
          </p>
        )}
        <div className="auth-page__ornament-container">
          {!!isRegistrationLoading && (
            <div className="auth-page__loading">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          {!!registrationSuccessText && !isRegistrationLoading && (
            <div
              className="auth-page__success-text"
              dangerouslySetInnerHTML={{ __html: registrationSuccessText }}
            />
          )}
          {!registrationSuccessText && !isRegistrationLoading && (
            <form
              action=""
              method="post"
              className="auth-page-form"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Ваше имя</label>
                <input
                  className="form__control_input form__control_full-width auth-page-form__control-input"
                  type="text"
                  name="first_name"
                  maxLength={50}
                  placeholder=""
                  defaultValue={regFormData ? regFormData.get("first_name") : ""}
                />
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Фамилия</label>
                <input
                  className="form__control_input form__control_full-width auth-page-form__control-input"
                  type="text"
                  name="last_name"
                  maxLength={50}
                  placeholder=""
                  defaultValue={regFormData ? regFormData.get("last_name") : ""}
                />
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">E-mail</label>
                <input
                  className="form__control_input form__control_full-width auth-page-form__control-input"
                  type="email"
                  name="email"
                  maxLength={50}
                  placeholder=""
                  autoComplete="email"
                  defaultValue={regFormData ? regFormData.get("email") : ""}
                />
              </div>
              <div className="auth-page-form__splitter">
                <div />
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Пароль</label>
                <input
                  className="form__control_input form__control_full-width auth-page-form__control-input"
                  type="password"
                  name="pass"
                  maxLength={50}
                  placeholder=""
                  autoComplete="new-password"
                  defaultValue={regFormData ? regFormData.get("pass") : ""}
                />
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Повторить пароль</label>
                <input
                  className="form__control_input form__control_full-width auth-page-form__control-input"
                  type="password"
                  name="passRepeat"
                  maxLength={50}
                  placeholder=""
                  autoComplete="new-password"
                  defaultValue={regFormData ? regFormData.get("passRepeat") : ""}
                />
              </div>
              <div className="auth-page-form__splitter">
                <div />
              </div>
              <div className="auth-page-form__group">
                <div
                  className="auth-page-form__control-checkbox"
                  onClick={() => toggleAgree("mailing")}
                >
                  <img src={isAgree["mailing"] ? checkboxOn : checkboxOff} />
                  <label className="auth-page-form__label" htmlFor="agreeGetNews">
                    Вы согласны получать новости сервиса раз в месяц
                  </label>
                </div>
              </div>
              <div className="auth-page-form__group">
                <div className="auth-page-form__control-checkbox" onClick={() => toggleAgree("pd")}>
                  <img src={isAgree["pd"] ? checkboxOn : checkboxOff} />
                  <label className="auth-page-form__label" htmlFor="agreeGetNews">
                    Я даю свое <a href="#">согласие</a> OOО &quot;CПИРО&quot; на обработку, в том
                    числе автоматизированную, своих персональных данных в соответствии ...
                  </label>
                </div>
              </div>
              <div className="auth-page-form__group">
                <button
                  type="submit"
                  className={`auth-page-form__control-submit ${isSubmitAllowed ? "" : "disabled"}`}
                  onClick={handleSubmit}
                >
                  Зарегистрироваться
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
