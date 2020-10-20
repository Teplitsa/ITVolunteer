import { ReactElement, useState, useEffect } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import Link from "next/link";
import MemberSocials from "../../MemberSocials";
import * as utils from "../../../utilities/utilities";

import TaskAuthorCompany from "./TaskAuthorCompany";
import MemberAvatarDefault from "../../../assets/img/member-default.svg";

const TaskAuthor: React.FunctionComponent = (): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);
  const author = useStoreState((state) => state.components.task.author);
  const {
    itvAvatar: avatarImage,
    fullName,
    profileURL: toProfile,
    authorReviewsCount: authorReviewsCount,
    doerReviewsCount: doerReviewsCount,
    facebook,
    instagram,
    vk,
    registrationDate,
  } = author;

  useEffect(() => {
    const abortController = new AbortController();

    try {
      avatarImage &&
        avatarImage.search(/temp-avatar\.png/) === -1 &&
        fetch(avatarImage, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then((response) => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

  return (
    author && (
      <>
        <h2>Помощь нужна</h2>
        <div className="sidebar-users-block">
          <div className="user-card">
            <div className="user-card-inner">
              <div
                className={`avatar-wrapper ${
                  isAvatarImageValid ? "" : "avatar-wrapper_medium-image"
                }`}
                style={{
                  backgroundImage: isAvatarImageValid
                    ? `url(${avatarImage})`
                    : `url(${MemberAvatarDefault})`,
                }}
              />
              <div className="details">
                <span className="status">Заказчик</span>
                <Link href={new URL(toProfile).pathname}>
                  <a className="name">{fullName}</a>
                </Link>
                <Link href={`${new URL(toProfile).pathname}#reviews`}>
                  <a className="reviews">
                    {`${
                      doerReviewsCount + authorReviewsCount
                    } ${utils.getReviewsCountString(
                      doerReviewsCount + authorReviewsCount
                    )}`}
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <TaskAuthorCompany />

          <div className="user-card-footer">
            <div className="user-card-footer__socials">
              <MemberSocials
                {...{
                  useComponents: ["facebook", "instagram", "vk"],
                  facebook,
                  instagram,
                  vk,
                }}
              />
            </div>
            <div className="user-card-footer__registration-date">
              Регистрация{" "}
              {new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
                .format(new Date(registrationDate * 1000))
                .replace(
                  /\s([а-я]+)\.\s/i,
                  (_, shortMonth) =>
                    ` ${shortMonth.replace(/^[а-я]/i, (letter: string) =>
                      letter.toUpperCase()
                    )} `
                )
                .replace(/\sг\./, "")}
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default TaskAuthor;
