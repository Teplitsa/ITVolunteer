import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import HomePasekaImage from "../../assets/img/home-paseka.svg";

const HomePaseka: React.FunctionComponent = (): ReactElement => {
  const template = useStoreState(state => state.components.homePage.template);

  if (template === "customer") return null;

  return (
    <section className="home-paseka">
      <div className="home-paseka__media">
        <img src={HomePasekaImage} alt="Пасека — сообщество специалистов из веб-студий" />
      </div>
      <div className="home-paseka__content">
        <div className="home-paseka__title">
          Вы студия или профи?
          <br />
          Вступайте в «Пасеку»!
        </div>
        <div className="home-paseka__text">
          Пасека — это сообщество из более 150 веб-студий, агентств, IT-компаний и независимых
          профессионалов, которые умеют и любят работать с некоммерческими организациями и
          социальными проектами.
        </div>
        <a
          href="https://paseka.org/"
          className="home-paseka__cta-btn btn btn_primary"
          target="_blank"
          rel="noreferrer"
        >
          Присоединиться
        </a>
      </div>
    </section>
  );
};

export default HomePaseka;
