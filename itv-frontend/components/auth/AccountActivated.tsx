import { ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const AccountActivated: React.FunctionComponent = (): ReactElement => {
  const {
    query: { status, message },
  } = useRouter();

  return (
    <div className="auth-page__illustration-container">
      <div className="auth-page__content auth-page__account-activated">
        <h1 className="auth-page__title">Активация учётной записи</h1>
        {status === "ok" && (
          <>
            <p className="auth-page__subtitle">
              Поздравляем! Ваша учетная запись активирована.
              <br />
              Теперь можно размещать задачи или откликнуться на задачу как волонтёр
            </p>
            <Link href="/login">
              <a className="auth-page-form__control-submit">Войти</a>
            </Link>
          </>
        )}
        {status !== "ok" && !message && (
          <p className="auth-page__subtitle auth-page__subtitle-error">Ошибка активации!</p>
        )}
        {status !== "ok" && !!message && (
          <p className="auth-page__subtitle auth-page__subtitle-error">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AccountActivated;
