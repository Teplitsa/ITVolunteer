import { ReactElement } from "react";

const MemberStats: React.FunctionComponent<{
  useComponents?: Array<"rating" | "reviewsCount" | "xp" | "solvedProblems">;
  rating?: number;
  reviewsCount?: number;
  xp?: number;
  solvedProblems?: number;
  withTopdivider?: boolean;
  withBottomdivider?: boolean;
  align?: "left" | "center";
}> = ({
  rating,
  reviewsCount,
  xp,
  solvedProblems,
  useComponents = ["rating", "reviewsCount", "xp", "solvedProblems"],
  withTopdivider = false,
  withBottomdivider = false,
  align = "center",
}): ReactElement => {
  const reviewsCountModulo =
    reviewsCount < 10
      ? reviewsCount
      : Number([...Array.from(String(reviewsCount))].pop());
  const solvedProblemsModulo =
    solvedProblems < 10
      ? solvedProblems
      : Number([...Array.from(String(reviewsCount))].pop());

  return (
    <div
      className={`member-stats ${
        withTopdivider ? "member-stats_top-divider" : ""
      } ${withBottomdivider ? "member-stats_bottom-divider" : ""} ${
        align === "center" ? "member-stats_align-center" : ""
      }`}
    >
      {useComponents.includes("rating") && (
        <div className="member-stats__item member-stats__item_calculated-rating">
          <div className="member-stats__calculated-rating">
            Оценка{" "}
            <span className="member-stats__calculated-rating-value">
              {rating ?? 0}
            </span>{" "}
            из 5
          </div>
        </div>
      )}
      {useComponents.includes("reviewsCount") && (
        <div className="member-stats__item member-stats__item_review-count">
          <div className="member-stats__review-count">
            {reviewsCount ?? 0}{" "}
            {reviewsCountModulo === 1
              ? "отзыв"
              : [2, 3, 4].includes(reviewsCountModulo)
              ? "отзыва"
              : "отзывов"}
          </div>
        </div>
      )}
      {useComponents.includes("xp") && (
        <div className="member-stats__item member-stats__item_xp">
          <div className="member-stats__xp">{xp ?? 0}</div>
        </div>
      )}
      {useComponents.includes("solvedProblems") && (
        <>
          <div className="member-stats__divider" />
          <div className="member-stats__item member-stats__item_solved-problems">
            <div className="member-stats__solved-problems">
              {solvedProblems ?? 0}{" "}
              {solvedProblemsModulo === 1
                ? "решенная задача"
                : [2, 3, 4].includes(solvedProblemsModulo)
                ? "решенные задачи"
                : "решенных задач"}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MemberStats;
