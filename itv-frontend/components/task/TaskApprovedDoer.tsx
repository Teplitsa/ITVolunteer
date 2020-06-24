import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import IconPaseka from "../../assets/img/icon-paseka.svg";

const TaskApprovedDoer: React.FunctionComponent = (): ReactElement => {
  const { approvedDoer, status: taskStatus } = useStoreState((state) => state.components.task);  

  if (!approvedDoer) return null;

  const {
    fullName,
    profileURL: toProfile,
    itvAvatar: avatarImage,
    solvedTasksCount,
    doerReviewsCount,
    isPasekaMember,
  } = approvedDoer;

  return (
    <>
      <h2>{taskStatus === "closed" ? "Помогли успешно решить задачу" : "Над задачей работает"}</h2>
      <div className="sidebar-users-block responses approved-doer">
        <div className="user-cards-list">
          <div className="user-card">
            <div className="user-card-inner">
              <div
                className="avatar-wrapper"
                style={{
                  backgroundImage: avatarImage ? `url(${avatarImage})` : "none",
                }}
              >
                {isPasekaMember && (
                  <img src={IconPaseka} className="itv-approved" />
                )}
              </div>
              <div className="details">
                <a className="name" href={toProfile}>
                  {fullName}
                </a>
                <span className="reviews">{`${doerReviewsCount} отзывов`}</span>
                <span className="status">{`Выполнено ${solvedTasksCount} задач`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskApprovedDoer;
