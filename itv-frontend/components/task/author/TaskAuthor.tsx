import { ReactElement, useState, useEffect } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
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
                <a className="name" href={toProfile}>
                  {fullName}
                </a>
                <span className="reviews">{`${doerReviewsCount + authorReviewsCount} отзывов`}</span>
              </div>
            </div>
          </div>

          <TaskAuthorCompany />
        </div>
      </>
    )
  );
};

export default TaskAuthor;
