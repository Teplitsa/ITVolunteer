import { ReactElement } from "react";
import { useStoreState } from "../../../../model/helpers/hooks";
import UserCardSmall from "../../../UserCardSmall";
import ratingStarMuted from "../../../../assets/img/icon-star-empty-gray.svg";
import ratingStarActive from "../../../../assets/img/icon-star-filled.svg";

const TaskTimelineReviewForAuthor: React.FunctionComponent = (): ReactElement => {
  const approvedDoer = useStoreState(state => state.components.task?.approvedDoer);
  const reviewer = useStoreState(state => state.components.task?.reviews?.reviewForAuthor);

  if (!approvedDoer || !reviewer) return null;

  return (
    <div className="user-speach">
      <UserCardSmall {...approvedDoer} />
      <div className="comment">
        {reviewer.message}
        <div className="rating-bar">
          <div className="stars">
            {Object.entries(Array(5).fill("Star")).map(([i, key]) => {
              const ratingValue = Number(i) + 1;
              return (
                <img
                  src={
                    (Number(reviewer.rating) >= ratingValue && ratingStarActive) || ratingStarMuted
                  }
                  key={`${key}${ratingValue}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTimelineReviewForAuthor;
