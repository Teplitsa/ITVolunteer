import { ReactElement } from "react";
import ReviewCard from "../../components/ReviewCard";

const MemberReviews: React.FunctionComponent = (): ReactElement => {
  const reviewCount = 230;
  const reviewCalculatedRating = 4.4;

  return (
    <div className="member-reviews">
      <div className="member-reviews__header">
        <div className="member-reviews__title">Отзывы</div>
        <div className="member-reviews__stats">
          <ul>
            <li>{reviewCount} отзывов</li>
            <li>Оценка {reviewCalculatedRating} из 5</li>
          </ul>
        </div>
      </div>
      <div className="member-reviews__list">
        {Array(3)
          .fill(null)
          .map((card, i) => (
            <ReviewCard key={i} />
          ))}
      </div>
      <div className="member-reviews__footer">
        <a href="#" className="member-reviews__more-link">
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberReviews;
