import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../../../assets/img/pic-logo-itv.svg";

const FooterNav: React.FunctionComponent = ({ children }): ReactElement => {
  const router = useRouter();

  return (
    <div className="header">
      <Link href="/">
        <a className="logo-col">
          <img src={Logo} className="logo" alt="IT-волонтер" />
        </a>
      </Link>
      <ul className="links-col">
          <li><Link href="/tasks"><a>Задачи</a></Link></li>
          <li><a href="/members">Волонтеры</a></li>
          <li className="drop-menu">
            <a href="/about">О проекте</a>
            <ul className="submenu">
              <li><Link href="/about"><a>О проекте</a></Link></li>
              <li><Link href="/conditions"><a>Правила участия</a></Link></li>
              <li>
                <Link href="/about-paseka">
                  <a className={
                    router.pathname === "/about-paseka"
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
              <li><Link href="/news"><a>Новости</a></Link></li>
              <li><Link href="/sovety-dlya-nko-uspeshnye-zadachi"><a>Советы НКО</a></Link></li>
              <li><Link href="/contacts"><a>Контакты</a></Link></li>
            </ul>                    
          </li>
      </ul>
    </div>
  );
};

export default FooterNav;
