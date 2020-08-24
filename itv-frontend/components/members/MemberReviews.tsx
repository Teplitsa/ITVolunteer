import { ReactElement } from "react";

import { useStoreState } from "../../model/helpers/hooks";
import ReviewCard from "../../components/ReviewCard";

const MemberReviews: React.FunctionComponent = (): ReactElement => {
  const { rating, reviewsCount, reviews } = useStoreState(
    (store) => store.components.memberAccount
  );

  const reviewsCountModulo =
    reviewsCount < 10
      ? reviewsCount
      : Number([...Array.from(String(reviewsCount))].pop());

  return (
    <div className="member-reviews">
      <div className="member-reviews__header">
        <div className="member-reviews__title">Отзывы</div>
        <div className="member-reviews__stats">
          <ul>
            <li>
              {reviewsCount}{" "}
              {reviewsCountModulo === 1
                ? "отзыв"
                : [2, 3, 4].includes(reviewsCountModulo)
                ? "отзыва"
                : "отзывов"}
            </li>
            <li>Оценка {rating} из 5</li>
          </ul>
        </div>
      </div>
      <div className="member-reviews__list">
        {reviews.map((review) => (
          <ReviewCard key={`Review-${review.id}`} {...review} />
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
