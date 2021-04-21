import { ReactElement } from "react";
import PhotoDesignerImage from "../../assets/img/photo-designer.png";

const HomeReviews: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-reviews">
      <div className="slider">
        <div className="slider__item">
          <div className="home-reviews__item">
            <div className="home-reviews__item-content">
              <blockquote>
                Нежно люблю платформу. На ней начался мой путь как «настоящего дизайнера»
                <cite>
                  Валентина Назарова
                  <br />
                  <small>веб-дизайнер, участник IT-волонтера</small>
                </cite>
              </blockquote>
            </div>
            <div className="home-reviews__item-media">
              <img className="home-reviews__item-media-image" src={PhotoDesignerImage} alt="" />
            </div>
          </div>
        </div>
        <div className="slider__nav">
          <div className="slider__nav-item slider__nav-item_active" />
          <div className="slider__nav-item" />
          <div className="slider__nav-item" />
        </div>
      </div>
    </section>
  );
};

export default HomeReviews;
