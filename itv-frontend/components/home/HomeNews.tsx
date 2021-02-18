import { ReactElement } from "react";

const news = [
  {
    url: "#",
    title: "Готовы включиться в борьбу с пандемией? Присоединяйтесь к группе IT-помощи",
    date: "2020-12-09",
  },
  {
    url: "#",
    title: "Вебинар: как выжить малому бизнесу и срочно перейти в онлайн",
    date: "2020-12-20",
  },
  {
    url: "#",
    title: "Готовы включиться в борьбу с пандемией? Присоединяйтесь к группе IT-помощи",
    date: "2020-12-20",
  },
];

const HomeNews: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="home-news">
      <h3 className="home-news__title">Новости платформы</h3>
      <ul className="home-news__list">
        {news.map(({ url, title, date }, i) => (
          <li key={i} className="home-news__item">
            <h4 className="home-news__item-title">
              <a href={url}>{title}</a>
            </h4>
            <time className="home-news__item-date" dateTime={date}>
              {new Intl.DateTimeFormat("ru-RU").format(new Date(date))}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeNews;
