import { ReactElement, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import ReviewCard from "../../components/ReviewCard";
import * as utils from "../../utilities/utilities";

const MemberReviews: React.FunctionComponent = (): ReactElement => {
  const rating = useStoreState(store => store.components.memberAccount.rating);
  const reviewsCount = useStoreState(store => store.components.memberAccount.reviewsCount);
  const reviews = useStoreState(store => store.components.memberAccount.reviews);
  const getMemberReviewsRequest = useStoreActions(
    actions => actions.components.memberAccount.getMemberReviewsRequest
  );
  const reviewsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (router.asPath.search("#reviews") !== -1) {
      const reviewsNode = reviewsRef.current;
      const reviewsSubstituteNode = reviewsNode.parentNode.querySelector(
        ".tabs-content__item-substitute"
      );

      (reviewsSubstituteNode ?? reviewsNode).scrollIntoView();
    }
  }, []);

  if (reviews.list.length === 0) return null;

  return (
    <div id="reviews" className="member-reviews" ref={reviewsRef}>
      <div className="member-reviews__header">
        <div className="member-reviews__title">Отзывы</div>
        <div className="member-reviews__stats">
          <ul>
            <li>
              {reviewsCount} {utils.getReviewsCountString(reviewsCount)}
            </li>
            <li>
              Оценка{" "}
              {rating
                ? rating.toFixed(1).toString().search(/\.0/) === -1
                  ? rating.toFixed(1)
                  : Math.round(rating)
                : 0}{" "}
              из 5
            </li>
          </ul>
        </div>
      </div>
      <div className="member-reviews__list">
        {reviews.list?.map(review => (
          <ReviewCard key={`Review-${review.id}`} {...review} />
        ))}
      </div>
      <div className="member-reviews__footer">
        <a
          href="#"
          className="member-reviews__more-link"
          onClick={event => {
            event.preventDefault();
            getMemberReviewsRequest({});
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberReviews;
