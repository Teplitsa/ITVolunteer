import { ReactElement, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import * as utils from "../../utilities/utilities";
import NewsList from "../../components/news/NewsList";

const NewsItem: React.FunctionComponent = (): ReactElement => {
  const otherNews = useStoreState((state) => state.components.otherNewsList)

  return (
    <article className="article article-page">
      <div className="page-path">
        <Link href="/news">
          <a className="page-path__item">Новости</a>
        </Link>
      </div>
      <NewsItemContent />
      <div className="news-list__separator" />
      <h5>Другие новости</h5>
      <NewsList {...otherNews} />
    </article>
  );
};

const NewsItemContent: React.FunctionComponent = (): ReactElement => {
  const { title, content, featuredImage, dateGmt } = useStoreState((state) => state.components.newsItem);

  return (
    <div className="article__content article-page__content">
      <h1
        className="article__title article-page__title"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      <div
        className="news-list-item__img"
      >
        <img src={utils.getPostFeaturedImageUrlBySize(featuredImage, "large")} />
      </div>

      <div
        className="news-list-item__date"
      >{utils.getTheDate({dateString: dateGmt, stringFormat: "dd.MM.yyyy"})}</div>

      <div
        className="article__content-text article-page__content-text"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

    </div>
  )
}

export default NewsItem;
