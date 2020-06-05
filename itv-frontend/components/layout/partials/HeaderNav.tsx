import { ReactElement, useEffect } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import ParticipantNav from "../../ParticipantNav";
import GuestNav from "../../GuestNav";
import Logo from "../../../assets/img/pic-logo-itv.svg";
import Cookies from 'js-cookie';
import * as C from "const"

const HeaderNav: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);
  const login = useStoreActions((actions) => actions.session.login);

  useEffect(() => {
    console.log("run login...")

    if(!process.browser) {
      return
    }

    if(isLoggedIn) {
      return
    }

    login({username: "", password: ""})
  }, [])

  function handleOldDesignClick(e) {
    if(!process.browser) {
      return
    }

    Cookies.set(C.ITV_COOKIE.OLD_DESIGN.name, C.ITV_COOKIE.OLD_DESIGN.value, { expires: C.ITV_COOKIE.OLD_DESIGN.period });
    document.location.reload();
  }

  return (
    <nav>
      <a href="/" className="logo-col">
        <img src={Logo} className="logo" alt="IT-волонтер" />
      </a>
      <ul className="main-menu-col">
        <li>
          <Link href="/tasks">
            <a>Задачи</a>
          </Link>
        </li>
        <li>
          <Link href="/members/hero">
            <a>Волонтеры</a>
          </Link>
        </li>
        <li className="drop-menu">
          <Link href="/about">
            <a className="drop-menu">О проекте</a>
          </Link>
          <ul className="submenu">
            <li><Link href="/about"><a>О проекте</a></Link></li>
            <li><Link href="/conditions"><a>Правила участия</a></Link></li>
            <li><Link href="/news"><a>Новости</a></Link></li>
            <li><Link href="/sovety-dlya-nko-uspeshnye-zadachi"><a>Советы НКО</a></Link></li>
            <li><Link href="/contacts"><a>Контакты</a></Link></li>
          </ul>                    
        </li>
      </ul>

      <div className="account-col">
        <a className="go-old" onClick={handleOldDesignClick}>Старый дизайн</a>
        {(isLoggedIn && <ParticipantNav />) || <GuestNav />}
      </div>
    </nav>
  );
};

export default HeaderNav;
