import { ReactElement } from "react";
import TeplitsaLogoImage from "../../assets/img/teplitsa-logo.svg";

const HomeFounder: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-founder">
      <h3 className="home-founder__title">Создатели проекта</h3>
      <div className="home-founder__content">
        <div className="home-founder__logo">
          <img src={TeplitsaLogoImage} alt="Теплица социальных технологий" />
        </div>
        <div className="home-founder__text">
          <p className="home-founder__lead">
            <b>«Теплица социальных технологий»</b> — просветительский проект, миссия которого
            сделать некоммерческий сектор России сильным и независимым с помощью информационных
            технологий.
          </p>
          <p>
            Наша миссия — развивать культуру создания гражданских онлайн-приложений. Мы связываем
            гражданских активистов и IT-специалистов. Одним мы рассказываем о том, как создавать
            онлайн-приложения. Вторым — объясняем, какие общественные проблемы можно решить с
            помощью информационных технологий. Мы считаем, что и технари, и общественники могут
            помочь друг другу — просто не знают, как. Наша задача — их познакомить.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeFounder;
