import { ReactElement, MouseEvent } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { useRouter } from "next/router";
import { regEvent } from "../../utilities/ga-events";

const HomeFooterCTAVolunteer: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();

  const handleCtaBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    router.push("/tasks");
  };

  return (
    <section className="home-cta">
      <div className="home-cta__content">
        <div className="home-cta__title">Сегодня отличный день, чтобы сделать мир лучше!</div>
        <a href="#" className="home-cta__btn btn" onClick={handleCtaBtnClick}>
          Смотреть задачи
        </a>
      </div>
    </section>
  );
};

const HomeFooterCTAAuthor: React.FunctionComponent = (): ReactElement => {
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const router = useRouter();

  const handleCtaBtnClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isLoggedIn) {
      regEvent("hp_ntask_bottom", router);
      router.push("/task-create");
    } else {
      regEvent("hp_reg_bottom", router);
      router.push("/registration");
    }
  };

  return (
    <section className="home-cta">
      <div className="home-cta__content">
        <div className="home-cta__title">
          Нужно создать сайт, нарисовать логотип или оживить соцсети?
        </div>
        <a href="#" className="home-cta__btn btn" onClick={handleCtaBtnClick}>
          Создать задачу
        </a>
      </div>
    </section>
  );
};

const HomeFooterCTA: React.FunctionComponent = (): ReactElement => {
  const template = useStoreState(state => state.components.homePage.template);

  return template === "customer" ? <HomeFooterCTAAuthor /> : <HomeFooterCTAVolunteer />;
};

export default HomeFooterCTA;
