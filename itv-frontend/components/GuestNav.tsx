import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";

const GuestNav: React.FunctionComponent = (): ReactElement => {
  const login = useStoreActions((actions) => actions.session.login);

  return (
    <div className="account-enter-links">
      <a href="/registration" className="account-enter-link account-login">Вход</a>
      <a href="/registration" className="account-enter-link account-registration">Регистрация</a>
    </div>
  );
};

export default GuestNav;
