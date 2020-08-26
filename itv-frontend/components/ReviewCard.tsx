import { ReactElement, useState } from "react";
import { IMemberReview } from "../model/model.typing";
import ReviewerCardSmall from "./ReviewerCardSmall";
import ReviewRatingSmall from "./ReviewRatingSmall";
import { getTheIntervalToNow, stripTags } from "../utilities/utilities";

const ReviewCard: React.FunctionComponent<IMemberReview> = (
  review
): ReactElement => {
  const [isFullDescription, setFullDescription] = useState<boolean>(false);
  const reviewerCardSmallProps = {
    fullName: "НКО «Леопарды Дальнего Востока»",
    task: {
      slug: "nuszhen-sajt-dlja-wordpress",
      title: "Нужен сайт на Word Press для нашей организации",
    },
  };

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__header-item">
          <ReviewRatingSmall
            caption={`Точно составлено ТЗ`}
            rating={review.rating}
          />
        </div>
        <div className="review-card__header-item">
          <ReviewRatingSmall
            caption={`Комфортное общение`}
            rating={review.communication_rating}
          />
        </div>
      </div>
      <div className="review-card__excerpt">
        {(isFullDescription && stripTags(review.message).trim()) ||
          `${stripTags(review.message).trim().substr(0, 109)}…`}{" "}
        {!isFullDescription && (
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setFullDescription(true);
            }}
          >
            Подробнее
          </a>
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
