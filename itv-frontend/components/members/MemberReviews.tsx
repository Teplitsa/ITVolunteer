import { ReactElement } from "react";

import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import ReviewCard from "../../components/ReviewCard";

const MemberReviews: React.FunctionComponent = (): ReactElement => {
  const { rating, reviewsCount, reviews } = useStoreState(
    (store) => store.components.memberAccount
  );
  const getMemberReviewsRequest = useStoreActions(
    (actions) => actions.components.memberAccount.getMemberReviewsRequest
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
        {reviews.list.map((review) => (
          <ReviewCard key={`Review-${review.id}`} {...review} />
        ))}
      </div>
      <div className="member-reviews__footer">
        <a
          href="#"
          className="member-reviews__more-link"
          onClick={(event) => {
            event.preventDefault();
            getMemberReviewsRequest();
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberReviews;
