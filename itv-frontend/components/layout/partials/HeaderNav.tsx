import { ReactElement, useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../../model/helpers/hooks";
import GlobalScripts, { ISnackbarMessage } from "../../../context/global-scripts";
import HeaderSearch from "./HeaderSearch";
import ParticipantNav from "../../ParticipantNav";
import GuestNav from "../../GuestNav";
import Logo from "../../../assets/img/pic-logo-itv.svg";
import iconMobileMenu from "../../../assets/img/icon-mobile-menu.png";
import { regEvent } from "../../../utilities/ga-events";

const { SnackbarContext } = GlobalScripts;

const HeaderNav: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const isLoggedIn = useStoreState(store => store.session.isLoggedIn);
  const itvRole = useStoreState(store => store.session.user.itvRole);
  const isLoaded = useStoreState(store => store.session.isLoaded);
  const login = useStoreActions(actions => actions.session.login);
  const authorizeSession = useStoreActions(actions => actions.session.authorizeSession);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHeaderSearchOpen, setHeaderSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    // console.log("run login...");

    if (!process.browser) {
      return;
    }

    if (isLoggedIn) {
      return;
    }

    if (!isLoaded) {
      // console.log("run ajax login...");
      login({ username: "", password: "" });
    } else {
      // console.log("run authorizeSession...");
      authorizeSession();
    }
  }, []);

  const handleCtaBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (!isLoggedIn || (isLoggedIn && itvRole === "author")) {
      router.push("/task-create");
    } else {
      router.push("/tasks");
    }
  };

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
          onClick={e => {
            e.preventDefault();
            setMobileOpen(!mobileOpen);
          }}
        >
          <img src={iconMobileMenu} alt="Меню" />
        </a>
      </div>

      <div className={`nav ${mobileOpen ? "mobile-open" : ""}`}>
        <Link href="/">
          <a className="logo-col">
            <img src={Logo} className="logo" alt="IT-волонтер" />
          </a>
        </Link>
        {!isHeaderSearchOpen && (
          <ul className="main-menu-col">
            <li>
              <Link href="/tasks">
                <a
                  className={router.pathname === "/tasks" ? "main-menu__link_active" : ""}
                  onClick={() => {
                    regEvent("m_tf_list", router);
                  }}
                >
                  Задачи
                </a>
              </Link>
            </li>
            <li>
              <Link href="/members">
                <a
                  className={router.pathname === "/members" ? "main-menu__link_active" : ""}
                  onClick={() => {
                    regEvent("m_mb_list", router);
                  }}
                >
                  Волонтеры
                </a>
              </Link>
            </li>
            <li className="drop-menu">
              <a
                className={
                  [
                    "/about",
                    "/conditions",
                    "/about-paseka",
                    "/nagrady",
                    "/news",
                    "/sovety-dlya-nko-uspeshnye-zadachi",
                    "/contacts",
                  ].includes(router.pathname)
                    ? "drop-menu main-menu__link_active"
                    : "drop-menu"
                }
                onClick={() => false}
              >
                О проекте
              </a>
              <ul className="submenu">
                <li>
                  <Link href="/about">
                    <a
                      onClick={() => {
                        regEvent("m_about", router);
                      }}
                    >
                      О проекте
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/conditions">
                    <a>Правила участия</a>
                  </Link>
                </li>
                <li>
                  <Link href="/about-paseka">
                    <a>Пасека</a>
                  </Link>
                </li>
                <li>
                  <Link href="/nagrady">
                    <a>Награды</a>
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

        {!isHeaderSearchOpen && (
          <div className="site-header__cta">
            <a
              href="#"
              className="site-header__cta-btn btn btn_primary"
              onClick={handleCtaBtnClick}
            >
              {!isLoggedIn || (isLoggedIn && itvRole === "author") ? "Создать задачу" : "Смотреть задачи"}
            </a>
          </div>
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
          {(isLoggedIn && <ParticipantNav />) || <GuestNav />}
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
