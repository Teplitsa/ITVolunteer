import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";

const MemberCardStats: React.FunctionComponent = (): ReactElement => {
  const { rating, reviewsCount, xp } = useStoreState(
    (store) => store.components.memberAccount
  );
  const reviewsCountModulo =
    reviewsCount < 10
      ? reviewsCount
      : Number([...Array.from(String(reviewsCount))].pop());

  return (
    <div className="member-card__stats">
      <div className="member-card__stats-item member-card__stats-item_calculated-rating">
        <div className="member-card__calculated-rating">
          Оценка{" "}
          <span className="member-card__calculated-rating-value">{rating}</span>{" "}
          из 5
        </div>
      </div>
      <div className="member-card__stats-item member-card__stats-item_review-count">
        <div className="member-card__review-count">
          {reviewsCount}{" "}
          {reviewsCountModulo === 1
            ? "отзыв"
            : [2, 3, 4].includes(reviewsCountModulo)
            ? "отзыва"
            : "отзывов"}
        </div>
      </div>
      <div className="member-card__stats-item member-card__stats-item_xp">
        <div className="member-card__xp">{xp}</div>
      </div>
    </div>
  );
};

export default MemberCardStats;
