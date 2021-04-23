import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import Link from "next/link";

const HomeNews: React.FunctionComponent = (): ReactElement => {
  const news = useStoreState(state => state.components.homePage.newsList);

  return (
    <section className="home-news">
      <h3 className="home-news__title">Новости платформы</h3>
      <ul className="home-news__list">
        {news?.map(({ _id, title, date, permalink }) => (
          <li key={`HomeNewsItem-${_id}`} className="home-news__item">
            <h4 className="home-news__item-title">
              <Link href={permalink}>
                <a>{title}</a>
              </Link>
            </h4>
            <time className="home-news__item-date" dateTime={date}>
              {date}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeNews;
