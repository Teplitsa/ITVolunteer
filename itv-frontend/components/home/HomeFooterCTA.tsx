import { ReactElement } from "react";

const HomeFooterCTA: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-cta">
      <div className="home-cta__content">
        <div className="home-cta__title">Сегодня отличный день, чтобы сделать мир лучше!</div>
        <a href="#" className="home-cta__btn btn">
          Смотреть задачи
        </a>
      </div>
    </section>
  );
};

export default HomeFooterCTA;
