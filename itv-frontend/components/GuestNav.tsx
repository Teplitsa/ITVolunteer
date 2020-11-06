import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { regEvent } from "../utilities/ga-events";

const GuestNav: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();

  return (
    <div className="account-enter-links">
      <Link href="/login">
        <a
          className="account-enter-link account-login"
          onClick={() => {
            regEvent("m_login", router);
          }}
        >
          Вход
        </a>
      </Link>
      <Link href="/registration">
        <a
          className="account-enter-link account-registration"
          onClick={() => {
            regEvent("m_reg", router);
          }}
        >
          Регистрация
        </a>
      </Link>
    </div>
  );
};

export default GuestNav;
