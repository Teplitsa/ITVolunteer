import { ReactElement } from "react";

const HomeAbout: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-about">
      <h2 className="home-about__title home-title">Что такое IT-волонтёр</h2>
      <div className="home-about__description">
        Это платформа, на которой встречаются IT-специалисты и гражданские активисты.
        <br />
        Специалисты помогают активистам решать задачи, чтобы те могли делать свою работу лучше.
      </div>
    </section>
  );
};

export default HomeAbout;
