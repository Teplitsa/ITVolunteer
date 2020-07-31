import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../../../assets/img/pic-logo-itv.svg";

const FooterNav: React.FunctionComponent = ({ children }): ReactElement => {
  const router = useRouter();

  return (
    <div className="header">
      <a href="/" className="logo-col">
        <img src={Logo} className="logo" alt="IT-волонтер" />
      </a>
      <ul className="links-col">
          <li><Link href="/tasks"><a>Задачи</a></Link></li>
          <li><a href="/members/hero">Волонтеры</a></li>
          <li className="drop-menu">
            <a href="/about">О проекте</a>
            <ul className="submenu">
              <li><a href="/about">О проекте</a></li>
              <li><a href="/conditions">Правила участия</a></li>
              <li>
                <Link href="/paseka">
                  <a className={
                    router.pathname === "/paseka"
                      ? "main-menu__link_active"
                      : ""
                  }>Пасека</a>
                </Link>
              </li>
              <li>
                <Link href="/nagrady">
                  <a className={
                    router.pathname === "/nagrady"
                      ? "main-menu__link_active"
                      : ""
                  }>Награды</a>
                </Link>
              </li>
              <li><a href="/news">Новости</a></li>
              <li><a href="/sovety-dlya-nko-uspeshnye-zadachi">Советы НКО</a></li>
              <li><a href="/contacts">Контакты</a></li>
            </ul>                    
          </li>
      </ul>
    </div>
  );
};

export default FooterNav;
