import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import NotifList from "../components/UserNotif"
import * as _ from "lodash"

import Bell from "../assets/img/icon-bell.svg";
import ArrowDown from "../assets/img/icon-arrow-down.svg";

const ParticipantNav: React.FunctionComponent = (): ReactElement => {
  const {
    fullName,
    profileURL: toProfile,
    itvAvatar: avatarImage,
  } = useStoreState((store) => store.session.user);

  // notif
  const [isShowNotif, setIsShowNotif] = useState(false)
  const user = useStoreState(store => store.session.user)
  const notifList = useStoreState(store => store.components.userNotif.notifList)
  const loadNotifList = useStoreActions(actions => actions.components.userNotif.loadNotifList)

  useEffect(() => {
      if(!user.id) {
          return
      }

      loadNotifList()
  }, [user])

  function handleNotifClick(e) {
      e.preventDefault()

      setIsShowNotif(!isShowNotif)
  }

  return (
    <div className="account-symbols">

      <div className="open-notif">

          <div onClick={handleNotifClick}>
              <img src={Bell} alt="Сообщения" />

              {!_.isEmpty(notifList) && 
              <span className="new-notif"></span>
              }
          </div>

          {!!isShowNotif && !_.isEmpty(notifList) && 
          <NotifList clickOutsideHandler={() => {
              setIsShowNotif(false)
          }}/>
          }
      </div>

      <div className="open-account-menu">
        <a href={user.profileURL} href={toProfile} target="_blank">
            <span 
                className="avatar-wrapper"
                style={{
                    backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
                }}
                title={user && `Привет, ${user.fullName}!`}
            />
            <img src={ArrowDown} className="arrow-down" alt={ArrowDown} />
        </a>

        <ul className="submenu">
          <li><Link href="/member-actions/member-tasks/"><a>Мои задачи</a></Link></li>
          <li><Link href="/task-actions/"><a>Новая задача</a></Link></li>
          <li><Link href={`/members/${user.username}`}><a>Мой профиль</a></Link></li>
          <li><Link href="/wp-login.php?action=logout"><a>Выйти</a></Link></li>
        </ul>

      </div>

    </div>
  );
};

export default ParticipantNav;
