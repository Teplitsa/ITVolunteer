import { ReactElement, useRef, SyntheticEvent } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import MemberCardAvatar from "../../assets/img/pic-member-card-avatar.svg";

const MemberCardStats: React.FunctionComponent = (): ReactElement => {
  const calculatedRating = 4.5;
  const reviewCount = 212;
  const xp = 12000;

  return (
    <div className="member-card__stats">
      <div className="member-card__stats-item member-card__stats-item_calculated-rating">
        <div className="member-card__calculated-rating">
          Оценка{" "}
          <span className="member-card__calculated-rating-value">
            {calculatedRating}
          </span>{" "}
          из 5
        </div>
      </div>
      <div className="member-card__stats-item member-card__stats-item_review-count">
        <div className="member-card__review-count">{reviewCount} отзывов</div>
      </div>
      <div className="member-card__stats-item member-card__stats-item_xp">
        <div className="member-card__xp">{xp}</div>
      </div>
    </div>
  );
};

export default MemberCardStats;
