import { ReactElement } from "react";
import Link from "next/link";
import Logo from "../../../assets/img/pic-logo-itv.svg";

const FooterNav: React.FunctionComponent = ({ children }): ReactElement => {
  return (
    <div className="header">
      <Link href="/">
        <a className="logo-col">
          <img src={Logo} className="logo" alt="IT-волонтер" />
        </a>
      </Link>
      <div className="links-col">
        <Link href="/tasks">
          <a>Задачи</a>
        </Link>
        <Link href="/members/hero">
          <a target="_blank">Волонтеры</a>
        </Link>
        <Link href="/about">
          <a className="drop-menu">О проекте</a>
        </Link>
      </div>
    </div>
  );
};

export default FooterNav;
