import { ReactElement, useState } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";
import { Image } from "../gutenberg/CoreMediaTextBlock";
import withFadeIn from "../hoc/withFadeIn";

import HomeAuthorHeroImage from "../../assets/img/home-author-hero.svg";
import HomeVolunteerHeroImage from "../../assets/img/home-volunteer-hero.svg";

const helpLineCategories = [
  "Веб-сайты и разработка",
  "Маркетинг и коммуникации",
  "Маркетинг и коммуникации",
  "Веб-сайты и разработка",
];

const HomeHeroVolunteer: React.FunctionComponent = (): ReactElement => {
  const [isLinkListShown, setIsLinkListShown] = useState<boolean>(false);

  const handleMoreClick = () => setIsLinkListShown(true);

  return (
    <section className="home-hero">
      <div className="home-hero__inner">
        <div className="home-hero__media">
          {withFadeIn({
            component: Image,
            mediaUrl: HomeVolunteerHeroImage,
            mediaAlt: "",
          })}
        </div>
        <div className="home-hero__content">
          <HomeInterfaceSwitch extraClasses="home-interface-switch_hero" />
          <div className="home-hero__title">90 проектов ждут помощи прямо сейчас</div>
          <div className="home-hero__subtitle">Чем вы можете помочь сейчас?</div>
          <div className="home-hero__link-list">
            {helpLineCategories.map((categoryName, i) => {
              if (!isLinkListShown && i === 2) {
                return (
                  <a
                    key="HelpLineCategory-More"
                    className="home-hero__link"
                    href="#"
                    onClick={handleMoreClick}
                  >
                    {`+${helpLineCategories.length - 2}`}
                  </a>
                );
              }

              if (isLinkListShown || i <= 1) {
                return (
                  <a key={`HelpLineCategory-${i}`} className="home-hero__link" href="#">
                    {categoryName}
                  </a>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const HomeHeroAuthor: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-hero">
      <div className="home-hero__inner">
        <div className="home-hero__media">
          {withFadeIn({
            component: Image,
            mediaUrl: HomeAuthorHeroImage,
            mediaAlt: "",
          })}
        </div>
        <div className="home-hero__content">
          <HomeInterfaceSwitch extraClasses="home-interface-switch_hero" />
          <div className="home-hero__title">
            Разместите задачу
            <br />и выберите помощника
          </div>
          <div className="home-hero__cta">
            <a className="btn btn_primary" href="#">
              Создать задачу
            </a>
          </div>
          <div className="home-hero__advice">
            Хотите сами решать социальные IT-задачи? <a href="#">Вам сюда</a>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomeHero: React.FunctionComponent = (): ReactElement => {
  const template = useStoreState(state => state.components.homePage.template);

  return template === "author" ? <HomeHeroAuthor /> : <HomeHeroVolunteer />;
};

export default HomeHero;
