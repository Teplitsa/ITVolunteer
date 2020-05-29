import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import ParticipantNav from "../../ParticipantNav";
import GuestNav from "../../GuestNav";
import Logo from "../../../assets/img/pic-logo-itv.svg";
import Cookies from 'js-cookie';
import * as C from "const"

const HeaderNav: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);

  function handleOldDesignClick(e) {
    if(!process.browser) {
      return
    }

    Cookies.set(C.ITV_COOKIE.OLD_DESIGN.name, C.ITV_COOKIE.OLD_DESIGN.value, { expires: C.ITV_COOKIE.OLD_DESIGN.period });
    document.location.reload();
  }

  return (
    <nav>
      <Link href="/">
        <a className="logo-col">
          <img src={Logo} className="logo" alt="IT-волонтер" />
        </a>
      </Link>
      <div className="main-menu-col">
        <Link href="/tasks">
          <a>Задачи</a>
        </Link>
        <Link href="/members/hero">
          <a>Волонтеры</a>
        </Link>
        <Link href="/about">
          <a className="drop-menu">О проекте</a>
        </Link>
      </div>
      <div className="account-col">
        <a className="go-old" onClick={handleOldDesignClick}>Старый дизайн</a>
        {(isLoggedIn && <ParticipantNav />) || <GuestNav />}
      </div>
    </nav>
  );
};

export default HeaderNav;
