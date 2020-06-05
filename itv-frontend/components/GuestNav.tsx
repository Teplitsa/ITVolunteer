import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";

const GuestNav: React.FunctionComponent = (): ReactElement => {
  const login = useStoreActions((actions) => actions.session.login);

  return (
    <div className="account-enter-links">
      <Link href="/registration">
        <a className="account-enter-link account-login">Вход</a>
      </Link>
      <Link href="/registration">
        <a className="account-enter-link account-registration">Регистрация</a>
      </Link>
    </div>
  );
};

export default GuestNav;
