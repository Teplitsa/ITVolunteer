import { ReactElement } from "react";
import ReviewerCardSmall from "./ReviewerCardSmall";
import ReviewRatingSmall from "./ReviewRatingSmall";

const ReviewCard: React.FunctionComponent = (): ReactElement => {
  const reviewerCardSmallProps = {
    fullName: "НКО «Леопарды Дальнего Востока»",
    task: 
    {
      slug: "nuszhen-sajt-dlja-wordpress",
      title: "Нужен сайт на Word Press для нашей организации"
    },
  };

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__header-item">
          <ReviewRatingSmall caption={`Точно составлено ТЗ`} rating={4} />
        </div>
        <div className="review-card__header-item">
          <ReviewRatingSmall caption={`Комфортное общение`} rating={4} />
        </div>
      </div>
      <div className="review-card__excerpt">
        Делаем сайт для всех кто хочет сохранить популяцию леопародов. Это сайт
        который поможет им расставить приоритеты. Сайт нужен на WordPress. Как
        хочу чтобы работало: 1. Eсть уже на сайте галерея карт…{" "}
        <a href="#">Подробнее</a>
      </div>
      <div className="review-card__footer">
        <div className="review-card__footer-item">
          <ReviewerCardSmall {...reviewerCardSmallProps} />
        </div>
        <div className="review-card__footer-item">
          <span className="review-card__date">3 часа назад</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
