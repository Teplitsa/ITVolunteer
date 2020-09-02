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
  const isTwitter = useComponents.includes("twitter") && twitter.search(/\S+/) !== -1;
  const isInstagram =
    useComponents.includes("instagram") && instagram.search(/\S+/) !== -1;
  const isVk = useComponents.includes("vk") && isLinkValid(vk);
  const isSkype = useComponents.includes("skype") && skype.search(/\S+/) !== -1;
  const isTelegram =
    useComponents.includes("telegram") && telegram.search(/\S+/) !== -1;

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
            href={facebook}
            title="Facebook"
            target="_blank"
          >
            Facebook
          </a>
        )}
        {isTwitter && (
          <a
            className="member-socials__item member-socials__item_twitter"
            href={`https://twitter.com/${twitter}`}
            title="Twitter"
            target="_blank"
          >
            Twitter
          </a>
        )}
        {isInstagram && (
          <a
            className="member-socials__item member-socials__item_instagram"
            href={`https://www.instagram.com/${instagram}`}
            title="Instagram"
            target="_blank"
          >
            Instagram
          </a>
        )}
        {isVk && (
          <a
            className="member-socials__item member-socials__item_vk"
            href={vk}
            title="VKontakte"
            target="_blank"
          >
            VKontakte
          </a>
        )}
        {isSkype && (
          <a
            className="member-socials__item member-socials__item_skype"
            href={`skype:${skype}?userinfo"`}
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
