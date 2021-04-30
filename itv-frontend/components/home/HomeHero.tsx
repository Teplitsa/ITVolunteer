import { ReactElement, useState, MouseEvent } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Link from "next/link";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";
import { Image } from "../gutenberg/CoreMediaTextBlock";
import withFadeIn from "../hoc/withFadeIn";
import { useRouter } from "next/router";
import { regEvent } from "../../utilities/ga-events";
import { getProjectCountString } from "../../utilities/utilities";

import HomeAuthorHeroImage from "../../assets/img/home-author-hero.svg";
import HomeVolunteerHeroImage from "../../assets/img/home-volunteer-hero.svg";

const HomeHeroVolunteer: React.FunctionComponent = (): ReactElement => {
  const [isLinkListShown, setIsLinkListShown] = useState<boolean>(false);
  const { task } = useStoreState(state => state.components.homePage.stats);

  const handleMoreClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    setIsLinkListShown(true);
  };

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
          <div className="home-hero__title">
            {task.total.publish} {getProjectCountString(task.total.publish)} ждут помощи
            прямо&nbsp;сейчас
          </div>
          <div className="home-hero__subtitle">Чем вы можете помочь сейчас?</div>
          <div className="home-hero__link-list">
            {task.featuredCategories.map(({ categoryName, categorySlug, taskCount }, i) => {
              if (!isLinkListShown && i === 2) {
                return (
                  <a
                    key="HelpLineCategory-More"
                    href="#"
                    className="home-hero__link"
                    onClick={handleMoreClick}
                  >
                    {`+${task.featuredCategories.length - 2}`}
                  </a>
                );
              }

              if (isLinkListShown || i <= 1) {
                return (
                  <Link href={`/tasks/tag/${categorySlug}`} key={`HelpLineCategory-${i}`}>
                    <a className="home-hero__link" title={`Количество задач: ${taskCount}`}>
                      {categoryName}
                    </a>
                  </Link>
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
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const setTemplate = useStoreActions(actions => actions.components.homePage.setTemplate);
  const router = useRouter();

  const handleCtaBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isLoggedIn) {
      regEvent("hp_new_task", router);
      router.push("/task-create");
    } else {
      regEvent("hp_reg_bottom", router);
      router.push("/registration");
    }
  };

  const handleAdviceBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    setTemplate({ template: "volunteer" });
  };

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
            <a href="#" className="btn btn_primary" onClick={handleCtaBtnClick}>
              Создать задачу
            </a>
          </div>
          <div className="home-hero__advice">
            Хотите сами решать социальные IT-задачи?{" "}
            <a href="#" onClick={handleAdviceBtnClick}>
              Вам сюда
            </a>
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
