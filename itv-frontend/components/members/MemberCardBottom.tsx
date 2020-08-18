import { ReactElement, useState } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberCardBottom: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="member-card__bottom">
      <div className="member-card__socials">
        <a
          className="member-card__socials-item member-card__socials-item_facebook"
          href="#"
          target="_blank"
        >
          Facebook
        </a>
        <a
          className="member-card__socials-item member-card__socials-item_instagram"
          href="#"
          target="_blank"
        >
          Instagram
        </a>
        <a
          className="member-card__socials-item member-card__socials-item_vk"
          href="#"
          target="_blank"
        >
          VKontakte
        </a>
      </div>
      <div className="member-card__registration-date">
        Регистрация 1 Апр 2004
      </div>
    </div>
  );
};

export default MemberCardBottom;
