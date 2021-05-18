import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import withFadeIn from "../hoc/withFadeIn";
import { Image } from "../gutenberg/CoreMediaTextBlock";

const HomePartners: React.FunctionComponent = (): ReactElement => {
  const partnerList = useStoreState(state => state.components.homePage.partnerList);

  return (
    <section className="home-partners">
      <h3 className="home-partners__title">Наши партнеры</h3>
      <ul className="home-partners__list">
        {partnerList.map(({ _id, thumbnail, title, content, website }) => (
          <li key={`PartnerListItem-${_id}`} className="home-partners__item">
            <div className="home-partners__item-logo">
              <a href={website} target="_blank" rel="noreferrer">
                {withFadeIn({
                  component: Image,
                  mediaUrl: thumbnail,
                  mediaAlt: title,
                })}
              </a>
            </div>
            <div className="home-partners__item-description">
              <p>{content}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomePartners;
