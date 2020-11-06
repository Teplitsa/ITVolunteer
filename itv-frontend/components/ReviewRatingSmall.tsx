import { ReactElement } from "react";

const ReviewRatingSmall: React.FunctionComponent<{
  caption: string;
  rating: number;
}> = ({ caption, rating }): ReactElement => {
  return (
    <div className="review-rating">
      <span className="review-rating__caption">{caption}</span>{" "}
      <span className="review-rating__stars">
        {Array(5)
          .fill(null)
          .map((star, i) => {
            return (
              <span
                key={`RatingStar-${i}`}
                className={`review-rating__star ${rating > i ? "review-rating__star_active" : ""}`}
              />
            );
          })}
      </span>
    </div>
  );
};

export default ReviewRatingSmall;
