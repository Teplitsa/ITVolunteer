import { ReactElement, useState, useEffect, useRef, ChangeEvent } from "react";
import {useRouter} from 'next/router'
import * as _ from "lodash";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Loader from "../Loader";

const ResetPassword: React.FunctionComponent = (): ReactElement => {
  const router = useRouter()

  const [userLogin, setUserLogin] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);  
  const [errorMessage, setErrorMessage] = useState<string>("");
  const resetPassword = useStoreActions((actions) => actions.session.resetPassword);
  const {isLoaded, isLoggedIn} = useStoreState((store) => store.session);

  const typeInUserLogin = (event: ChangeEvent<HTMLInputElement>) => {
    setUserLogin(event.target.value);
  };

  const submit = () => {
    setErrorMessage("");
    if(userLogin && userLogin.trim()) {
      setLoading(true);
      resetPassword({
        userLogin,
        successCallbackFn: () => {
          router.push("/reset-password-success");
        }, 
        errorCallbackFn: (message) => {
          setErrorMessage(message);
          setLoading(false);
        }, 
      });
    }
  };

  useEffect(() => {
    if(!isLoaded) {
      return
    }

    if(isLoggedIn) {
      router.push("/tasks");      
    }
  }, [isLoaded, isLoggedIn])

  return (
    <>
      <h1 className="auth-page__title">Забыли пароль?</h1>
      <p className="auth-page__subtitle">
        Введите email или имя пользователя.<br />
        Мы сбросим пароль и пришлем вам инструкцию, <br />как получить новый
      </p>

      <div className="reset-password__form-container">

        {!isLoading ? <form action="" method="post" className="auth-page-form"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <div className="auth-page-form__group">
              <label className="auth-page-form__label">Имя пользователя или e-mail</label>
              <input className="auth-page-form__control-input" type="text" name="user_login" maxLength={50} placeholder="" tabIndex={1}
                onChange={typeInUserLogin}
              />
              <span className="auth-page-form__control-error">
                {errorMessage &&
                  <>{errorMessage}</>
                }
                </span>
            </div>
            <div className="auth-page-form__group">
              <button type="submit" className={`auth-page-form__control-submit`} tabIndex={3}>Получиь новый пароль</button>
            </div>        
          </form>
          : <Loader />
        }
          
      </div>
    </>
  );
};

export default ResetPassword;
