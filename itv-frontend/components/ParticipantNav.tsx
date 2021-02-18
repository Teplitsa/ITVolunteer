import { ReactElement, useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import NotifList from "../components/UserNotif";
import * as utils from "../utilities/utilities";
import * as _ from "lodash";
import { regEvent } from "../utilities/ga-events";

import Bell from "../assets/img/icon-bell.svg";
import MemberAvatarDefault from "../assets/img/member-default.svg";

const ParticipantNav: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  // notif
  const [isShowNotif, setIsShowNotif] = useState(false);
  const user = useStoreState(store => store.session.user);
  const itvAvatar = useStoreState(store => store.session.user.itvAvatar);
  const notifList = useStoreState(store => store.components.userNotif.notifList);
  const loadNotifList = useStoreActions(actions => actions.components.userNotif.loadNotifList);
  const loadFreshNotifList = useStoreActions(
    actions => actions.components.userNotif.loadFreshNotifList
  );
  const setRole = useStoreActions(actions => actions.session.setRole);
  const setUserItvRole = useStoreActions(actions => actions.session.setUserItvRole);

  useEffect(() => {
    if (!user.id) {
      return;
    }

    loadNotifList();
  }, [user]);

  function handleNotifClick(e) {
    e.preventDefault();

    setIsShowNotif(!isShowNotif);
  }

  useEffect(() => {
    const id = setInterval(loadFreshNotifList, 1000 * 20);
    return () => {
      clearInterval(id);
    };
  });

  useEffect(() => {
    const abortController = new AbortController();

    try {
      itvAvatar &&
        itvAvatar.search(/temp-avatar\.png/) === -1 &&
        fetch(itvAvatar, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then(response => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, [itvAvatar]);

  function handleLoginAsRoleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (router.pathname === "/members/[username]") {
      event.preventDefault();
    }

    const newItvRole = user.itvRole === "doer" ? "author" : "doer";

    setRole({
      itvRole: newItvRole,
      successCallbackFn: () => {
        setUserItvRole(newItvRole);
      },
      errorCallbackFn: message => {
        console.log(message);
      },
    });
  }

  return (
    <>
      <div className="account-symbols">
        <div className="open-notif">
          <div className="open-notif__action" onClick={handleNotifClick}>
            <img src={Bell} alt="Сообщения" />

            {!_.isEmpty(notifList) && <span className="new-notif"></span>}
          </div>

          {!!isShowNotif && !_.isEmpty(notifList) && (
            <NotifList
              clickOutsideHandler={() => {
                setIsShowNotif(false);
              }}
            />
          )}
        </div>

        <div className="open-account-menu">
          <a className="open-account-menu__avatar-card" href={user.profileURL}>
            <span
              className={`avatar-wrapper ${
                isAvatarImageValid ? "" : "avatar-wrapper_default-image"
              }`}
              style={{
                backgroundImage: isAvatarImageValid
                  ? `url(${itvAvatar})`
                  : `url(${MemberAvatarDefault}), linear-gradient(#fff, #fff)`,
              }}
              title={user && `Привет, ${user.fullName}!`}
            >
              <span className="open-account-menu__xp">{user.xp}</span>
            </span>
          </a>

          <ul className="submenu">
            <li className="submenu__item submenu__item_bottom-divider">
              <Link href="/members/[username]/profile" as={`/members/${user.slug}/profile`}>
                <a>
                  {user.firstName}
                  <span className="submenu__item-subtitle">Профиль</span>
                </a>
              </Link>
            </li>
            <li className="submenu__item">
              <Link href="/members/[username]" as={`/members/${user.slug}`}>
                <a onClick={() => regEvent("m_profile", router)}>Личный кабинет</a>
              </Link>
            </li>
            <li className="submenu__item">
              <Link href="/tasks">
                <a>Поиск задач</a>
              </Link>
            </li>
            <li className="submenu__item submenu__item_bottom-divider">
              <Link href="/members/[username]/security" as={`/members/${user.slug}/security`}>
                <a>Управление аккаунтом</a>
              </Link>
            </li>
            <li className="submenu__item">
              <Link href="/members/[username]" as={`/members/${user.slug}`}>
                <a onClick={handleLoginAsRoleClick}>{`Войти как ${
                  user.itvRole === "doer" ? "автор" : "волонтер"
                }`}</a>
              </Link>
            </li>
            <li className="submenu__item">
              <a href={utils.decodeHtmlEntities(user.logoutUrl)}>Выйти</a>
            </li>
          </ul>
        </div>
      </div>

      <ul className="submenu account-submenu-mobile">
        <li>
          <Link href="/members/[username]/profile" as={`/members/${user.slug}/profile`}>
            <a>Профиль</a>
          </Link>
        </li>
        <li>
          <Link href="/members/[username]" as={`/members/${user.slug}`}>
            <a onClick={() => regEvent("m_profile", router)}>Личный кабинет</a>
          </Link>
        </li>
        <li>
          <Link href="/tasks">
            <a>Поиск задач</a>
          </Link>
        </li>
        <li className="submenu__item">
          <Link href="/members/[username]/security" as={`/members/${user.slug}/security`}>
            <a>Управление аккаунтом</a>
          </Link>
        </li>
        <li>
          <Link href="/members/[username]" as={`/members/${user.slug}`}>
            <a onClick={handleLoginAsRoleClick}>{`Войти как ${
              user.itvRole === "doer" ? "автор" : "волонтер"
            }`}</a>
          </Link>
        </li>
        <li>
          <a href={utils.decodeHtmlEntities(user.logoutUrl)}>Выйти</a>
        </li>
      </ul>
    </>
  );
};

export default ParticipantNav;
