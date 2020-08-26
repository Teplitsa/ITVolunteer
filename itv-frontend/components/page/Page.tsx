import { ReactElement, useState, useEffect, useRef } from "react";
import { useStoreState } from "../../model/helpers/hooks";

const Page: React.FunctionComponent = (): ReactElement => {
  const { title, content } = useStoreState((state) => state.components.page);

  return (
    <article className="article article-page">
      <div className="article__content article-page__content">
        <h1
          className="article__title article-page__title"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <div
          className="article__content-text article-page__content-text"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </div>
    </article>
  );
};

export default Page;
