import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";

const MemberCardBottom: React.FunctionComponent = (): ReactElement => {
  const {
    registrationDate,
    email,
    phone,
    facebook,
    twitter,
    vk,
    skype,
    telegram,
  } = useStoreState((state) => state.components.memberAccount);

  return (
    <div className="member-card__bottom">
      <div className="member-card__contacts">
        <div className="member-card__contacts-email">
          <a href={`mail:${email}`}>{email}</a>
        </div>
        {phone && (
          <div className="member-card__contacts-phone">
            <a href={`tel:${phone.replace(/[^0-9|+]+/g, "")}`}>{phone}</a>
          </div>
        )}
      </div>
      <div className="member-card__socials">
        <a
          className="member-card__socials-item member-card__socials-item_facebook"
          href={facebook ? facebook : "#"}
          title={facebook ? "Facebook" : "Аккаунт не указан"}
          target={facebook ? "_blank" : "_self"}
          onClick={(event) => !facebook && event.preventDefault()}
        >
          Facebook
        </a>
        <a
          className="member-card__socials-item member-card__socials-item_twitter"
          href={twitter ? twitter : "#"}
          title={twitter ? "Twitter" : "Аккаунт не указан"}
          target={twitter ? "_blank" : "_self"}
          onClick={(event) => !twitter && event.preventDefault()}
        >
          Twitter
        </a>
        <a
          className="member-card__socials-item member-card__socials-item_vk"
          href={vk ? vk : "#"}
          title={vk ? "VKontakte" : "Аккаунт не указан"}
          target={vk ? "_blank" : "_self"}
          onClick={(event) => !vk && event.preventDefault()}
        >
          VKontakte
        </a>
        <a
          className="member-card__socials-item member-card__socials-item_skype"
          href={skype ? skype : "#"}
          title={skype ? "Skype" : "Аккаунт не указан"}
          target={skype ? "_blank" : "_self"}
          onClick={(event) => !skype && event.preventDefault()}
        >
          Skype
        </a>
        <a
          className="member-card__socials-item member-card__socials-item_telegram"
          href={telegram ? telegram : "#"}
          title={telegram ? "Telegram" : "Аккаунт не указан"}
          target={telegram ? "_blank" : "_self"}
          onClick={(event) => !telegram && event.preventDefault()}
        >
          Telegram
        </a>
      </div>
      <div className="member-card__registration-date">
        Участвует с{" "}
        {new Intl.DateTimeFormat("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(registrationDate * 1000))}
      </div>
    </div>
  );
};

export default MemberCardBottom;
