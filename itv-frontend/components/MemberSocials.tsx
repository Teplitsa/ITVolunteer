import { ReactElement } from "react";
import { isLinkValid } from "../utilities/utilities";

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
  const isFacebook =
    useComponents.includes("facebook") && isLinkValid(facebook);
  const isTwitter = useComponents.includes("facebook") && isLinkValid(twitter);
  const isInstagram =
    useComponents.includes("facebook") && isLinkValid(instagram);
  const isVk = useComponents.includes("facebook") && isLinkValid(vk);
  const isSkype = useComponents.includes("skype") && skype.search(/\S+/) !== -1;
  const isTelegram =
    useComponents.includes("telegram") && telegram.search(/@\S+/) !== -1;

  return (
    (isFacebook ||
      isTwitter ||
      isInstagram ||
      isVk ||
      isSkype ||
      isTelegram) && (
      <div className="member-socials">
        {isFacebook && (
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
        {isTwitter && (
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
        {isInstagram && (
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
        {isVk && (
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
        {isSkype && (
          <a
            className="member-socials__item member-socials__item_skype"
            href={`href="skype:${skype}?userinfo"`}
            title="Skype"
            target="_blank"
          >
            Skype
          </a>
        )}
        {isTelegram && (
          <a
            className="member-socials__item member-socials__item_telegram"
            href={`tg://resolve?domain=${telegram}`}
            title="Telegram"
            target="_blank"
          >
            Telegram
          </a>
        )}
      </div>
    )
  );
};

export default MemberSocials;
