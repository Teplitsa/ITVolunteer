import { ReactElement, useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Loader from "../Loader";

const SetPassword: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const changePassword = useStoreActions(actions => actions.session.changePassword);
  const { isLoaded, isLoggedIn } = useStoreState(store => store.session);

  const typeIn = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const typeInRepeat = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPasswordRepeat(event.target.value);
  };

  const submit = () => {
    console.log(_.get(router, "query.key", ""));
    setErrorMessage("");

    if (!newPassword || !newPassword.trim()) {
      setErrorMessage("Введите пароль");
    } else if (newPassword !== newPasswordRepeat) {
      setErrorMessage("Пароли не совпадают");
    } else {
      setLoading(true);

      changePassword({
        newPassword: newPassword,
        key: _.get(router, "query.key", ""),
        successCallbackFn: () => {
          router.push({
            pathname: "/login",
            query: { passwordChanged: "ok" },
          });
        },
        errorCallbackFn: message => {
          setErrorMessage(message);
          setLoading(false);
        },
      });
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isLoggedIn) {
      router.push("/tasks");
    } else {
      setLoading(true);
      fetch(
        "/wp-login.php?action=rp&key=" +
          _.get(router, "query.key", "") +
          "&login=" +
          _.get(router, "query.login", "")
      ).then(() => {
        setLoading(false);
      });
    }
  }, [isLoaded, isLoggedIn]);

  return (
    <>
      <h1 className="auth-page__title">Введите свой новый пароль.</h1>
      <p className="auth-page__subtitle">
        Подсказка: Рекомендуется задать пароль длиной не менее двенадцати символов. Чтобы сделать
        его надёжнее, используйте буквы верхнего и нижнего регистра, числа и символы наподобие !
        &quot; ? $ % ^ &amp; ).
      </p>

      <div className="reset-password__form-container">
        {!isLoading ? (
          <form
            action=""
            method="post"
            className="auth-page-form"
            onSubmit={event => {
              event.preventDefault();
              submit();
            }}
          >
            <div className="auth-page-form__group">
              <label className="auth-page-form__label">Новый пароль</label>
              <input
                className="form__control_input form__control_full-width auth-page-form__control-input"
                type="password"
                name="new_password"
                maxLength={50}
                placeholder=""
                tabIndex={1}
                onChange={typeIn}
              />
            </div>
            <div className="auth-page-form__group">
              <label className="auth-page-form__label">Повторите пароль</label>
              <input
                className="form__control_input form__control_full-width auth-page-form__control-input"
                type="password"
                name="new_password_repeat"
                maxLength={50}
                placeholder=""
                tabIndex={1}
                onChange={typeInRepeat}
              />
              <span className="auth-page-form__control-error">
                {errorMessage && <>{errorMessage}</>}
              </span>
            </div>
            <div className="auth-page-form__group">
              <button type="submit" className={`auth-page-form__control-submit`} tabIndex={3}>
                Задать пароль
              </button>
            </div>
          </form>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default SetPassword;
