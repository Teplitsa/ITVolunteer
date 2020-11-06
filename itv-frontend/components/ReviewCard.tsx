import { ReactElement, useState, useEffect, useRef } from "react";
import { IMemberReview } from "../model/model.typing";
import ReviewerCardSmall from "./ReviewerCardSmall";
import ReviewRatingSmall from "./ReviewRatingSmall";
import { getTheIntervalToNow } from "../utilities/utilities";

const maxExcerptLength = 300;

const ReviewCard: React.FunctionComponent<IMemberReview> = (review): ReactElement => {
  const [isFullDescription, setFullDescription] = useState<boolean>(false);
  const excerptRef = useRef<HTMLSpanElement>(null);
  const reviewer = review.type === "as_author" ? review.author : review.doer;
  const reviewerCardSmallProps = {
    avatar: reviewer.itvAvatar,
    fullName: reviewer.organizationName || reviewer.fullName,
    task: review.task ? { slug: `/tasks/${review.task.slug}`, title: review.task.title } : null,
  };

  useEffect(() => {
    if (excerptRef.current.innerHTML.length > maxExcerptLength) {
      excerptRef.current.innerHTML = `${excerptRef.current.innerHTML.substr(0, maxExcerptLength)}…`;
    } else {
      setFullDescription(true);
    }
  }, []);

  useEffect(() => {
    if (isFullDescription) {
      excerptRef.current.innerHTML = review.message.trim();
    }
  }, [isFullDescription]);

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__header-item">
          <ReviewRatingSmall caption={`Точно составлено ТЗ`} rating={review.rating} />
        </div>
        {review.communication_rating > 0 && (
          <div className="review-card__header-item">
            <ReviewRatingSmall
              caption={`Комфортное общение`}
              rating={review.communication_rating}
            />
          </div>
        )}
      </div>
      <div className="review-card__excerpt">
        <span ref={excerptRef} dangerouslySetInnerHTML={{ __html: review.message.trim() }} />
        {!isFullDescription && (
          <>
            {" "}
            <a
              href="#"
              onClick={event => {
                event.preventDefault();
                setFullDescription(true);
              }}
            >
              Подробнее
            </a>
          </>
        )}
      </div>
      <div className="review-card__footer">
        <div className="review-card__footer-item">
          <ReviewerCardSmall {...reviewerCardSmallProps} />
        </div>
        <div className="review-card__footer-item">
          <span className="review-card__date">
            {getTheIntervalToNow({
              fromDateString: review.time_add,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
