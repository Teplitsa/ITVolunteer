import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import withFadeIn from "../hoc/withFadeIn";
import { Image } from "../gutenberg/CoreMediaTextBlock";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";
import { IAdvantage } from "../../model/model.typing";

const HomeBenefitsVolunteer: React.FunctionComponent<{ volunteerBenefits: Array<IAdvantage> }> = ({
  volunteerBenefits,
}): ReactElement => {
  return (
    <section className="home-benefits">
      <h3 className="home-benefits__title home-title">Что вы найдёте на IT-волонтёре</h3>
      <HomeInterfaceSwitch />
      <ul className="home-benefits__list">
        {volunteerBenefits.map(({ _id, title, content, thumbnail }) => (
          <li key={`BenefitListItem-${_id}`} className="home-benefits__item">
            <div className="home-benefits__item-media">
              {withFadeIn({
                component: Image,
                mediaUrl: thumbnail,
                mediaAlt: title,
              })}
            </div>
            <div className="home-benefits__item-content">
              <h4 className="home-benefits__item-title">{title}</h4>
              <div className="home-benefits__item-text">
                <p>{content}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const HomeBenefitsAuthor: React.FunctionComponent<{ authorBenefits: Array<IAdvantage> }> = ({
  authorBenefits,
}): ReactElement => {
  return (
    <section className="home-benefits">
      <h3 className="home-benefits__title home-title">Что вы найдёте на IT-волонтёре</h3>
      <HomeInterfaceSwitch />
      <ul className="home-benefits__list">
        {authorBenefits.map(({ _id, title, content, thumbnail }) => (
          <li key={`BenefitListItem-${_id}`} className="home-benefits__item">
            <div className="home-benefits__item-media">
              {withFadeIn({
                component: Image,
                mediaUrl: thumbnail,
                mediaAlt: title,
              })}
            </div>
            <div className="home-benefits__item-content">
              <h4 className="home-benefits__item-title">{title}</h4>
              <div className="home-benefits__item-text">
                <p>{content}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const HomeBenefits: React.FunctionComponent = (): ReactElement => {
  const template = useStoreState(state => state.components.homePage.template);
  const advantageList = useStoreState(state => state.components.homePage.advantageList);

  return template === "customer" ? (
    <HomeBenefitsAuthor
      authorBenefits={advantageList.filter(advantage => advantage.userRole === "customer")}
    />
  ) : (
    <HomeBenefitsVolunteer
      volunteerBenefits={advantageList.filter(advantage => advantage.userRole === "volunteer")}
    />
  );
};

export default HomeBenefits;
