import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import Slider from "../global-scripts/Slider";

const HomeReviews: React.FunctionComponent = (): ReactElement => {
  const reviewList = useStoreState(state => state.components.homePage.reviewList);

  return (
    <section className="home-reviews">
      <Slider>
        {reviewList.map(({ _id, title, content, thumbnail }) => (
          <div key={`HomeReviewsItem-${_id}`} className="home-reviews__item">
            <div
              className="home-reviews__item-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div className="home-reviews__item-media">
              <img className="home-reviews__item-media-image" src={thumbnail} alt={title} />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HomeReviews;
