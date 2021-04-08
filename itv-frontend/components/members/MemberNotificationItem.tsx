import { ReactElement, Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { INotification } from "../../model/model.typing";
import NoAvatarIcon from "../../assets/img/icon-no-avatar_24x24.svg";

const MemberNotificationItem: React.FunctionComponent<INotification> = ({
  type,
  avatar,
  icon,
  title,
  time,
}): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();

    try {
      avatar &&
        avatar.search(/temp-avatar\.png/) === -1 &&
        fetch(avatar, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then(response => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, [avatar]);

  return (
    <div
      className={`member-notifications__list-item ${
        (type && `member-notifications__list-item_${type}`) || ""
      }`}
    >
      <div className="member-notifications__item-card">
        <img
          className="member-notifications__item-avatar member-notifications__item-avatar_no-image"
          src={isAvatarImageValid ? avatar : NoAvatarIcon}
          alt=""
        />
        <div
          className={`member-notifications__item-type member-notifications__item-type_${icon}`}
        />
      </div>
      <div className="member-notifications__item-title">
        {title.map(({ text, keyword, link }, i) => {
          if (type === "custom-message") {
            return (
              <Fragment key={`NotificationTitleElement-${i}}`}>
                <span dangerouslySetInnerHTML={{ __html: text || "" }} />{" "}
              </Fragment>
            );
          } else if (typeof text !== "undefined") {
            return (
              <Fragment key={`NotificationTitleElement-${i}}`}>
                <span dangerouslySetInnerHTML={{ __html: text }} />{" "}
              </Fragment>
            );
          } else if (typeof keyword !== "undefined") {
            return (
              <Fragment key={`NotificationTitleElement-${i}}`}>
                <span
                  className="member-notifications__keyword"
                  dangerouslySetInnerHTML={{ __html: keyword }}
                />{" "}
              </Fragment>
            );
          } else if (typeof link !== "undefined") {
            return (
              <Fragment key={`NotificationTitleElement-${i}}`}>
                <Link href={link.url}>
                  <a
                    className={`member-notifications__item-title ${
                      (link.type === "highlight" &&
                        "member-notifications__item-title-link_highlight") ||
                      "member-notifications__item-title-link_normal"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.text }}
                  />
                </Link>{" "}
              </Fragment>
            );
          }
        })}
      </div>
      <div className="member-notifications__item-time">{time}</div>
    </div>
  );
};

export default MemberNotificationItem;
