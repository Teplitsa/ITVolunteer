import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import NotifList from "../components/UserNotif";
import * as utils from "../utilities/utilities";
import * as _ from "lodash";

import Bell from "../assets/img/icon-bell.svg";
import MemberAvatarDefault from "../assets/img/member-default.svg";

const ParticipantNav: React.FunctionComponent = (): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  // notif
  const [isShowNotif, setIsShowNotif] = useState(false);
  const user = useStoreState((store) => store.session.user);
  const notifList = useStoreState(
    (store) => store.components.userNotif.notifList
  );
  const loadNotifList = useStoreActions(
    (actions) => actions.components.userNotif.loadNotifList
  );
  const loadFreshNotifList = useStoreActions(
    (actions) => actions.components.userNotif.loadFreshNotifList
  );

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
    let id = setInterval(loadFreshNotifList, 1000 * 20);
    return () => {
      clearInterval(id);
    };
  });

  useEffect(() => {
    const abortController = new AbortController();

    try {
      user.itvAvatar &&
        user.itvAvatar.search(/temp-avatar\.png/) === -1 &&
        fetch(user.itvAvatar, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then((response) => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

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
                  ? `url(${user.itvAvatar})`
                  : `url(${MemberAvatarDefault}), linear-gradient(#fff, #fff)`,
              }}
              title={user && `Привет, ${user.fullName}!`}
            >
              <span className="open-account-menu__xp">{user.xp}</span>
            </span>
          </a>

          <ul className="submenu">
            <li>
              <Link href="/task-actions/">
                <a>Новая задача</a>
              </Link>
            </li>
            <li>
              <Link href={`/members/${user.username}`}>
                <a>Личный кабинет</a>
              </Link>
            </li>
            <li>
              <a href={utils.decodeHtmlEntities(user.logoutUrl)}>Выйти</a>
            </li>
          </ul>
        </div>
      </div>

      <ul className="submenu account-submenu-mobile">
        <li>
          <a href="/member-actions/member-tasks/">Мои задачи</a>
        </li>
        <li>
          <a href="/task-actions/">Новая задача</a>
        </li>
        <li>
          <a href={`/members/${user.username}`}>Мой профиль</a>
        </li>
        <li>
          <a href={utils.decodeHtmlEntities(user.logoutUrl)}>Выйти</a>
        </li>
      </ul>
    </>
  );
};

export default ParticipantNav;
