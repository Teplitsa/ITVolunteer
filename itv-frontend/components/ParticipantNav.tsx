import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../model/helpers/hooks";
import Bell from "../assets/img/icon-bell.svg";
import ArrowDown from "../assets/img/icon-arrow-down.svg";

const ParticipantNav: React.FunctionComponent = (): ReactElement => {
  const {
    fullName,
    profileURL: toProfile,
    itvAvatar: avatarImage,
  } = useStoreState((store) => store.session.user);

  return (
    <div className="account-symbols">
      <Link href="#">
        <a className="open-notif">
          <img src={Bell} alt="Сообщения" />
          {true && <span className="new-notif"></span>}
        </a>
      </Link>
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
