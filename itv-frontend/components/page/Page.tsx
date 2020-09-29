import { ReactElement, useState, useEffect, useRef } from "react";
import {useRouter} from 'next/router';
import { useStoreState } from "../../model/helpers/hooks";
import { regEvent } from "../../utilities/ga-events";

const Page: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { title, content } = useStoreState((state) => state.components.page);

  useEffect(() => {
    regEvent('ge_show_new_desing', router);
  }, [router.pathname]);

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
