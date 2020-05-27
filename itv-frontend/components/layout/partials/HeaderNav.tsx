import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../../model/helpers/hooks";
import ParticipantNav from "../../ParticipantNav";
import GuestNav from "../../GuestNav";
import Logo from "../../../assets/img/pic-logo-itv.svg";

const HeaderNav: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);

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
        <Link href="/old">
          <a className="go-old">Старый дизайн</a>
        </Link>
        {(isLoggedIn && <ParticipantNav />) || <GuestNav />}
      </div>
    </nav>
  );
};

export default HeaderNav;
