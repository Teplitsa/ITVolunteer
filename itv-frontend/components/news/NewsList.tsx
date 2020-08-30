import { ReactElement, useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import { INewsListState } from "../../model/model.typing";
import * as utils from "../../utilities/utilities";

const NewsList: React.FunctionComponent<INewsListState> = ({ items }): ReactElement => {

  return (
    <div className="news-list">
    {items.map((item, key) => {
      return (
        <Fragment key={`news-list-item-key-${key}`}>
        <Link href="/blog/[slug]" as={`/blog/${item.slug}`}>
          <a className="news-list__item">
            <NewsListItem item={item} />
          </a>
        </Link>
        {!!(key % 2) &&
          <div className="news-list__separator"/>
        }
        </Fragment>
      )
    })}
    </div>
  );
};

export const NewsListItem: React.FunctionComponent<{item: any}> = ({item}): ReactElement => {

  return (
    <article className="news-list-item">
      <div className="news-list-item__content">
        <div
          className="news-list-item__img"
        >
          <img src={utils.getPostFeaturedImageUrlBySize(item.featuredImage, "medium")} />
        </div>

        <h2
          className="news-list-item__title"
          dangerouslySetInnerHTML={{ __html: item.title }}
        />

        <div
          className="news-list-item__date"
        >{utils.getTheDate({dateString: item.dateGmt, stringFormat: "dd.MM.yyyy"})}</div>

        <div
          className="news-list-item__excerpt"
          dangerouslySetInnerHTML={{
            __html: item.excerpt,
          }}
        />
      </div>
    </article>
  );
};

export default NewsList;
