import { ReactElement } from "react";
import { useStoreState } from "../../../../model/helpers/hooks";
import UserCardSmall from "../../../UserCardSmall";
import ratingStarMuted from "../../../../assets/img/icon-star-empty-gray.svg";
import ratingStarActive from "../../../../assets/img/icon-star-filled.svg";

const TaskTimelineReviewForDoer: React.FunctionComponent = (): ReactElement => {
  const author = useStoreState(state => state.components.task?.author);
  const reviewer = useStoreState(state => state.components.task?.reviews?.reviewForDoer);

  if (!author || !reviewer) return null;

  return (
    <div className="user-speach">
      <UserCardSmall {...author} />
      <div className="comment">
        {reviewer.message && <span dangerouslySetInnerHTML={{ __html: reviewer.message }} />}
        <div className="rating-bar">
          <div className="stars">
            {Object.entries(Array(5).fill("reviewForDoerRating")).map(([i, key]) => {
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

export default TaskTimelineReviewForDoer;
