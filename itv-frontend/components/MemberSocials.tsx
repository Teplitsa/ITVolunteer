import { ReactElement } from "react";
import { isLinkValid } from "../utilities/utilities";

type SocialNetName = "facebook" | "twitter" | "instagram" | "vk" | "skype" | "telegram";
type SocialBtnSize = "24x24" | "40x40";
type SocialBtnBg = "default-bg" | "white-bg" | "green-bg";

const getSocialBtnClassList = ({
  socialNet,
  size,
  bg,
}: {
  socialNet: string;
  size: SocialBtnSize;
  bg: SocialBtnBg;
}): string => {
  return Object.entries({
    "member-socials__item": true,
    [`member-socials__item_${socialNet}`]: true,
    [`member-socials__item_${size}`]: true,
    [`member-socials__item_${socialNet}-${bg}`]: bg !== "default-bg",
  })
    .reduce((classList, [className, isActive]) => {
      isActive && classList.push(className);
      return classList;
    }, [])
    .join(" ");
};

const MemberSocials: React.FunctionComponent<{
  useComponents: Array<SocialNetName>;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  vk?: string;
  skype?: string;
  telegram?: string;
  iconParams?: {
    size?: SocialBtnSize;
    bg?: SocialBtnBg;
  };
}> = ({
  useComponents,
  iconParams = { size: "24x24", bg: "default-bg" },
  facebook,
  twitter,
  instagram,
  vk,
  skype,
  telegram,
}): ReactElement => {
  const { size, bg } = iconParams;
  const isFacebook = useComponents.includes("facebook") && isLinkValid(facebook);
  const isTwitter = useComponents.includes("twitter") && twitter.search(/\S+/) !== -1;
  const isInstagram = useComponents.includes("instagram") && instagram.search(/\S+/) !== -1;
  const isVk = useComponents.includes("vk") && isLinkValid(vk);
  const isSkype = useComponents.includes("skype") && skype.search(/\S+/) !== -1;
  const isTelegram = useComponents.includes("telegram") && telegram.search(/\S+/) !== -1;

  return (
    (isFacebook || isTwitter || isInstagram || isVk || isSkype || isTelegram) && (
      <div className="member-socials">
        {isFacebook && (
          <a
            className={getSocialBtnClassList({
              socialNet: "facebook",
              size,
              bg,
            })}
            href={facebook}
            title="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
        )}
        {isTwitter && (
          <a
            className={getSocialBtnClassList({
              socialNet: "twitter",
              size,
              bg,
            })}
            href={`https://twitter.com/${twitter}`}
            title="Twitter"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
        )}
        {isInstagram && (
          <a
            className={getSocialBtnClassList({
              socialNet: "instagram",
              size,
              bg,
            })}
            href={`https://www.instagram.com/${instagram}`}
            title="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        )}
        {isVk && (
          <a
            className={getSocialBtnClassList({
              socialNet: "vk",
              size,
              bg,
            })}
            href={vk}
            title="VKontakte"
            target="_blank"
            rel="noreferrer"
          >
            VKontakte
          </a>
        )}
        {isSkype && (
          <a
            className={getSocialBtnClassList({
              socialNet: "skype",
              size,
              bg,
            })}
            href={`skype:${skype}?userinfo"`}
            title="Skype"
            target="_blank"
            rel="noreferrer"
          >
            Skype
          </a>
        )}
        {isTelegram && (
          <a
            className={getSocialBtnClassList({
              socialNet: "telegram",
              size,
              bg,
            })}
            href={`https://t.me/${telegram}`}
            title="Telegram"
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
        )}
      </div>
    )
  );
};

export default MemberSocials;
