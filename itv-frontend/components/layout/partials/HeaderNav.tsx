import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import GlobalScripts, {
  ISnackbarMessage,
} from "../../../context/global-scripts";
import HeaderSearch from "./HeaderSearch";
import ParticipantNav from "../../ParticipantNav";
import GuestNav from "../../GuestNav";
import Logo from "../../../assets/img/pic-logo-itv.svg";
import iconMobileMenu from "../../../assets/img/icon-mobile-menu.png";
import Cookies from "js-cookie";
import * as C from "const";

const { SnackbarContext } = GlobalScripts;

const HeaderNav: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const isLoggedIn = useStoreState((store) => store.session.isLoggedIn);
  const login = useStoreActions((actions) => actions.session.login);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHeaderSearchOpen, setHeaderSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log("run login...");

    if (!process.browser) {
      return;
    }

    if (isLoggedIn) {
      return;
    }

    login({ username: "", password: "" });
  }, []);

  function handleOldDesignClick(e) {
    if (!process.browser) {
      return;
    }

    Cookies.set(C.ITV_COOKIE.OLD_DESIGN.name, C.ITV_COOKIE.OLD_DESIGN.value, {
      expires: C.ITV_COOKIE.OLD_DESIGN.period,
    });
    document.location.reload();
  }

  return (
    <nav>
      <div className="nav-mobile">
        <Link href="/">
          <a className="logo-col">
            <img src={Logo} className="logo" alt="IT-волонтер" />
          </a>
        </Link>
        <a
          href="#"
          className="open-mobile-menu"
          onClick={(e) => {
            e.preventDefault();
            setMobileOpen(!mobileOpen);
          }}
        >
          <img src={iconMobileMenu} alt="Меню" />
        </a>
      </div>

      <div className={`nav ${mobileOpen ? "mobile-open" : ""}`}>
        <a href="/" className="logo-col">
          <img src={Logo} className="logo" alt="IT-волонтер" />
        </a>
        {!isHeaderSearchOpen && (
          <ul className="main-menu-col">
            <li>
              <Link href="/tasks">
                <a
                  className={
                    router.pathname === "/tasks" ? "main-menu__link_active" : ""
                  }
                >
                  Задачи
                </a>
              </Link>
            </li>
            <li>
              <a href="/members">Волонтеры</a>
            </li>
            <li className="drop-menu">
              <a className="drop-menu" onClick={() => false}>
                О проекте
              </a>
              <ul className="submenu">
                <li>
                  <Link href="/about">
                    <a>О проекте</a>
                  </Link>
                </li>
                <li>
                  <Link href="/conditions">
                    <a>Правила участия</a>
                  </Link>
                </li>
                <li>
                  <Link href="/about-paseka">
                    <a
                      className={
                        router.pathname === "/about-paseka"
                          ? "main-menu__link_active"
                          : ""
                      }
                    >
                      Пасека
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/nagrady">
                    <a
                      className={
                        router.pathname === "/nagrady"
                          ? "main-menu__link_active"
                          : ""
                      }
                    >
                      Награды
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/news">
                    <a>Новости</a>
                  </Link>
                </li>
                <li>
                  <Link href="/sovety-dlya-nko-uspeshnye-zadachi">
                    <a>Советы НКО</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contacts">
                    <a>Контакты</a>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        )}

        <SnackbarContext.Consumer>
          {({ dispatch }) => {
            const addSnackbar = (message: ISnackbarMessage) => {
              dispatch({ type: "add", payload: { messages: [message] } });
            };
            return (
              <HeaderSearch
                {...{
                  addSnackbar,
                  isOpen: isHeaderSearchOpen,
                  setOpen: setHeaderSearchOpen,
                }}
              />
            );
          }}
        </SnackbarContext.Consumer>

        <div className={`account-col ${isLoggedIn ? "logged-in" : ""}`}>
          <a className="go-old" onClick={handleOldDesignClick}>
            Старый&nbsp;дизайн
          </a>
          {(isLoggedIn && <ParticipantNav />) || <GuestNav />}
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
