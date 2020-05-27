import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import TaskAuthorCompany from "./TaskAuthorCompany";

const TaskAuthor: React.FunctionComponent = (): ReactElement => {
  const author = useStoreState((state) => state.components.task.author);

  if (!author) return null;

  const {
    itvAvatar: avatarImage,
    fullName,
    authorReviewsCount: reviewsCount,
  } = author;

  return (
    <>
      <h2>Помощь нужна</h2>
      <div className="sidebar-users-block">
        <div className="user-card">
          <div className="user-card-inner">
            <div
              className="avatar-wrapper"
              style={{
                backgroundImage: avatarImage ? `url(${avatarImage})` : "none",
              }}
            />
            <div className="details">
              <span className="status">Заказчик</span>
              <span className="name">{fullName}</span>
              <span className="reviews">{`${reviewsCount} отзывов`}</span>
            </div>
          </div>
        </div>

        <TaskAuthorCompany />
      </div>
    </>
  );
};

export default TaskAuthor;
