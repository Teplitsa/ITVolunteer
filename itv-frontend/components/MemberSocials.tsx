import { ReactElement } from "react";

const MemberSocials: React.FunctionComponent<{
  useComponents: Array<
    "facebook" | "twitter" | "instagram" | "vk" | "skype" | "telegram"
  >;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  vk?: string;
  skype?: string;
  telegram?: string;
}> = ({
  useComponents,
  facebook,
  twitter,
  instagram,
  vk,
  skype,
  telegram,
}): ReactElement => {
  return (
    <div className="member-socials">
      {useComponents.includes("facebook") && (
        <a
          className="member-socials__item member-socials__item_facebook"
          href={facebook ? facebook : "#"}
          title={facebook ? "Facebook" : "Аккаунт не указан"}
          target={facebook ? "_blank" : "_self"}
          onClick={(event) => !facebook && event.preventDefault()}
        >
          Facebook
        </a>
      )}
      {useComponents.includes("twitter") && (
        <a
          className="member-socials__item member-socials__item_twitter"
          href={twitter ? twitter : "#"}
          title={twitter ? "Twitter" : "Аккаунт не указан"}
          target={twitter ? "_blank" : "_self"}
          onClick={(event) => !twitter && event.preventDefault()}
        >
          Twitter
        </a>
      )}
      {useComponents.includes("instagram") && (
        <a
          className="member-socials__item member-socials__item_instagram"
          href={instagram ? instagram : "#"}
          title={instagram ? "Instagram" : "Аккаунт не указан"}
          target={instagram ? "_blank" : "_self"}
          onClick={(event) => !instagram && event.preventDefault()}
        >
          Instagram
        </a>
      )}
      {useComponents.includes("vk") && (
        <a
          className="member-socials__item member-socials__item_vk"
          href={vk ? vk : "#"}
          title={vk ? "VKontakte" : "Аккаунт не указан"}
          target={vk ? "_blank" : "_self"}
          onClick={(event) => !vk && event.preventDefault()}
        >
          VKontakte
        </a>
      )}
      {useComponents.includes("skype") && (
        <a
          className="member-socials__item member-socials__item_skype"
          href={skype ? skype : "#"}
          title={skype ? "Skype" : "Аккаунт не указан"}
          target={skype ? "_blank" : "_self"}
          onClick={(event) => !skype && event.preventDefault()}
        >
          Skype
        </a>
      )}
      {useComponents.includes("telegram") && (
        <a
          className="member-socials__item member-socials__item_telegram"
          href={telegram ? telegram : "#"}
          title={telegram ? "Telegram" : "Аккаунт не указан"}
          target={telegram ? "_blank" : "_self"}
          onClick={(event) => !telegram && event.preventDefault()}
        >
          Telegram
        </a>
      )}
    </div>
  );
};

export default MemberSocials;
