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

      <a className="open-account-menu" href={toProfile} target="_blank">
        <span
          className="avatar-wrapper"
          style={{
            backgroundImage: avatarImage ? `url(${avatarImage})` : "none",
          }}
          title={fullName && `Привет, ${fullName}!`}
        />
        <img src={ArrowDown} className="arrow-down" alt={ArrowDown} />
      </a>
    </div>
  );
};

export default ParticipantNav;
