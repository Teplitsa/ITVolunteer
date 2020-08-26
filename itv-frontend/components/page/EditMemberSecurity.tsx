import { ReactElement, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { ISnackbarMessage } from "../../context/global-scripts";
import * as _ from "lodash";

const EditMemberSecurity: React.FunctionComponent<{
  addSnackbar: (message: ISnackbarMessage) => void;
  clearSnackbar: () => void;
  deleteSnackbar: (message: ISnackbarMessage) => void;
}> = ({ addSnackbar, clearSnackbar, deleteSnackbar }): ReactElement => {
  const formRef = useRef(null);
  const { username, email } = useStoreState((state) => state.session.user);
  const updateUserLoginDataRequest = useStoreActions(
    (actions) => actions.components.memberSecurity.updateUserLoginDataRequest
  );

  const [isAgree, setIsAgree] = useState({ pd: false, mailing: false });
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);
  const [registrationSuccessText, setRegistrationSuccessText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [regFormData, setRegFormData] = useState(null);

  useEffect(() => {
    const security = new FormData();

    security.append("first_name", username);
    security.append("email", email);
    security.append("pass", "");
    security.append("passRepeat", "");

    setRegFormData(security);
  }, []);

  useEffect(() => {
    var allowed = true;
    for (var k in isAgree) {
      allowed = allowed && !!isAgree[k];
    }
    setIsSubmitAllowed(allowed);
  }, [isAgree]);

  function toggleAgree(e, agreeName) {
    setIsAgree({ ...isAgree, ...{ [agreeName]: !isAgree[agreeName] } });
  }

  function successCallback(message) {
    setRegistrationSuccessText(message);
    setIsLoading(false);
  }

  function errorCallback(message) {
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
        text: "Введите логин",
      });
    }

    if (!formData.get("email") || !formData.get("email").trim()) {
      isValid = false;
      addSnackbar({
        context: "error",
        text: "Введите email",
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

    var formData = new FormData(formRef.current);
    setRegFormData(formData);

    if (validateFormData(formData)) {
      setIsLoading(true);
      updateUserLoginDataRequest({
        formData,
        successCallbackFn: successCallback,
        errorCallbackFn: errorCallback,
      });
    }
  }

  return (
    <div className="auth-page__illustration-container">
      <div className="auth-page__content auth-page__registration">
        <h1 className="auth-page__title">Управление аккаунтом</h1>
        <div className="auth-page__ornament-container">
          {!!isLoading && (
            <div className="auth-page__loading">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          {!!registrationSuccessText && !isLoading && (
            <div className="auth-page__success-text">
              {registrationSuccessText}
            </div>
          )}
          {!registrationSuccessText && !isLoading && (
            <form
              action=""
              method="post"
              className="auth-page-form"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">Логин</label>
                <input
                  className="auth-page-form__control-input"
                  type="text"
                  name="login"
                  maxLength={50}
                  placeholder=""
                  defaultValue={
                    regFormData ? regFormData.get("first_name") : ""
                  }
                />
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">E-mail</label>
                <input
                  className="auth-page-form__control-input"
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
                <label className="auth-page-form__label">Новый пароль</label>
                <input
                  className="auth-page-form__control-input"
                  type="password"
                  name="pass"
                  maxLength={50}
                  placeholder=""
                  autoComplete="new-password"
                  defaultValue={regFormData ? regFormData.get("pass") : ""}
                />
                <div className="auth-page-form__control-subtext">
                  Если вы хотите изменить пароль, укажите здесь новое значение.
                  В противном случае оставьте пустым.
                </div>
              </div>
              <div className="auth-page-form__group">
                <label className="auth-page-form__label">
                  Повторить пароль
                </label>
                <input
                  className="auth-page-form__control-input"
                  type="password"
                  name="passRepeat"
                  maxLength={50}
                  placeholder=""
                  autoComplete="new-password"
                  defaultValue={
                    regFormData ? regFormData.get("passRepeat") : ""
                  }
                />
              </div>
              <div className="auth-page-form__group">
                <button
                  type="submit"
                  className={`auth-page-form__control-submit`}
                  onClick={handleSubmit}
                >
                  Сохранить
                </button>
              </div>
              <div className="auth-page-form__group center">
                <Link href={`/members/${username}`}>
                  <a className="auth-page-form__control-link-go-back">
                    Вернуться в режим просмотра
                  </a>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMemberSecurity;
