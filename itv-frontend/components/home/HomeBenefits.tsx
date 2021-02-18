import { ReactElement } from "react";
import HomeInterfaceSwitch from "./HomeInterfaceSwitch";

import RealPracticeImage from "../../assets/img/home-benefits-real-practice.svg";
import LongTermCooperationImage from "../../assets/img/home-benefits-long-term-cooperation.svg";
import PermanentGrowthImage from "../../assets/img/home-benefits-permanent-growth.svg";
import BenefitsPortfolioImage from "../../assets/img/home-benefits-portfolio.svg";
import SocialTasksImage from "../../assets/img/home-benefits-social-tasks.svg";

const benefits = [
  {
    image: RealPracticeImage,
    title: "Реальная практика",
    text:
      "Волонтёрство — билет в профессию для новичков: здесь вы найдёте свой первый проект и прокачаете навыки в бою.",
  },
  {
    image: LongTermCooperationImage,
    title: "Долгосрочное сотрудничество",
    text: "Многие волонтёры после разовых задач получают приглашение в большой проект.",
  },
  {
    image: PermanentGrowthImage,
    title: "Постоянное развитие",
    text:
      "Мы регулярно проводим обучающие мастерские с опытными кураторами, где волонтёры прокачивают свои навыки.",
  },
  {
    image: BenefitsPortfolioImage,
    title: "Кейсы в портфолио",
    text: "Вы добавите реальные проекты в портфолио вместо того, чтобы работать  «в стол».",
  },
  {
    image: BenefitsPortfolioImage,
    title: "Вдохновляющие проекты",
    text:
      "Делайте то, что находит у вас отклик — например, помогайте детям или улучшайте городскую среду.",
  },
  {
    image: SocialTasksImage,
    title: "Социально значимые задачи",
    text: "Каждый проект делает чью-то жизнь лучше — ваша помощь будет иметь реальный эффект. ",
  },
];

const HomeBenefits: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-benefits">
      <h3 className="home-benefits__title home-title">Что вы найдете на IT-волонтере</h3>
      <HomeInterfaceSwitch />
      <ul className="home-benefits__list">
        {benefits.map(({ image, title, text }, i) => (
          <li key={`BenefitListItem-${i}`} className="home-benefits__item">
            <div className="home-benefits__item-media">
              <img src={image} alt={title} />
            </div>
            <div className="home-benefits__item-content">
              <h4 className="home-benefits__item-title">{title}</h4>
              <div className="home-benefits__item-text">
                <p>{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeBenefits;
