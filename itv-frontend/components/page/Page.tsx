import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { regEvent } from "../../utilities/ga-events";

const Page: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { title, content } = useStoreState(state => state.components.page);
  const setCrumbs = useStoreActions(actions => actions.components.breadCrumbs.setCrumbs);

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  useEffect(() => {
    setCrumbs([
      {title: title},
    ]);  
  }, [title]);

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
