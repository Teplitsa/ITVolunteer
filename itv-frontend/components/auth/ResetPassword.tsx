import { ReactElement, useState, useEffect, useRef, ChangeEvent } from "react";
import {useRouter} from 'next/router'
import * as _ from "lodash";

const ResetPassword: React.FunctionComponent = (): ReactElement => {
  const router = useRouter()

  const [userLogin, setUserLogin] = useState<string>("");
  const [isUserLoginNotFound, setUserLoginNotFound] = useState<boolean>(false);
  const typeInUserLogin = (event: ChangeEvent<HTMLInputElement>) => {
    setUserLogin(event.target.value);
  };

  const submit = () => {
    if(userLogin && userLogin.trim()) {
    }
  };

  return (
    <>
      <h1 className="auth-page__title">Забыли пароль?</h1>
      <p className="auth-page__subtitle">
        Введите адрес e-maila на который вы зарегистрировались.<br />
        Мы сбросим пароль и пришлем вам  инструкцию, <br />как получить новый
      </p>

      <div className="reset-password__form-container">

        <form action="" method="post" className="auth-page-form"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="auth-page-form__group">
            <label className="auth-page-form__label">Имя пользователя или e-mail</label>
            <input className="auth-page-form__control-input" type="text" name="user_login" maxLength={50} placeholder="" tabIndex={1}
              onChange={typeInUserLogin}
              onKeyUp={(event) => {
                event.preventDefault();
                event.key === "Enter" && submit();
              }}
            />
            {isUserLoginNotFound &&
              <span className="auth-page-form__control-error">Ошибка! Такого e-mail у нас не зарегестрировано</span>
            }
          </div>
          <div className="auth-page-form__group">
            <button type="submit" className={`auth-page-form__control-submit`} tabIndex={3}>Получиь новый пароль</button>
          </div>        
        </form>
          
      </div>
    </>
  );
};

export default ResetPassword;
