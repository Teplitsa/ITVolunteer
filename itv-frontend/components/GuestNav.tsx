import { ReactElement } from "react";
import Link from "next/link";
import { useStoreActions } from "../model/helpers/hooks";

const GuestNav: React.FunctionComponent = (): ReactElement => {
  const login = useStoreActions((actions) => actions.session.login);

  return (
    <div className="account-enter-links">
      <a
        href="#"
        className="account-enter-link account-login"
        onClick={(event) => {
          event.preventDefault();
          login({ username: "test", password: "123123" });
        }}
      >
        Вход
      </a>
      <Link href="/registration">
        <a className="account-enter-link account-registration">Регистрация</a>
      </Link>
    </div>
  );
};

export default GuestNav;
