import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import { regEvent } from "../utilities/ga-events"

const GuestNav: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const login = useStoreActions((actions) => actions.session.login);

  return (
    <div className="account-enter-links">
      <Link href="/login">
        <a
          className="account-enter-link account-login"
          onClick={(e) => {
            regEvent('m_login', router);
          }}                  
        >Вход</a>
      </Link>
      <Link href="/registration">
        <a
          className="account-enter-link account-registration"
          onClick={(e) => {
            regEvent('m_reg', router);
          }}                  
        >Регистрация</a>
      </Link>
    </div>
  );
};

export default GuestNav;
