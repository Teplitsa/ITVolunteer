import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";

const MemberCardBottom: React.FunctionComponent = (): ReactElement => {
  const { registrationDate, facebook, instagram, vk } = useStoreState(
    (state) => state.components.memberAccount
  );

  return (
    <div className="member-card__bottom">
      <div className="member-card__socials">
        <a
          className="member-card__socials-item member-card__socials-item_facebook"
          href={facebook ? facebook : "#"}
          title={facebook ? "Instagram" : "Аккаунт не указан"}
          target={facebook ? "_blank" : "_self"}
          onClick={(event) => !facebook && event.preventDefault()}
        >
          Facebook
        </a>
        <a
          className="member-card__socials-item member-card__socials-item_instagram"
          href={instagram ? instagram : "#"}
          title={instagram ? "Instagram" : "Аккаунт не указан"}
          target={instagram ? "_blank" : "_self"}
          onClick={(event) => !instagram && event.preventDefault()}
        >
          Instagram
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
      </div>
      <div className="member-card__registration-date">
        Регистрация{" "}
        {new Intl.DateTimeFormat("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(registrationDate * 1000))}
      </div>
    </div>
  );
};

export default MemberCardBottom;
