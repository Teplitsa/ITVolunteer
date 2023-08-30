import { ReactElement, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { regEvent } from "../../utilities/ga-events";

import PasechnikImage from "../../assets/img/pasechnik.svg";

const Paseka: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const [isPasechnikImageShown, showPasechnikImage] = useState<boolean>(false);
  const pasechnikImageRef = useRef<HTMLImageElement>(null);
  const { title, content } = useStoreState(state => state.components.paseka);
  const setCrumbs = useStoreActions(actions => actions.components.breadCrumbs.setCrumbs);

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  useEffect(() => {
    setCrumbs([
      {title: title},
    ]);  
  }, [title]);

  useEffect(() => {
    new IntersectionObserver(([imageRef]) => imageRef.isIntersecting && showPasechnikImage(true), {
      threshold: 0,
    }).observe(pasechnikImageRef.current);
  }, []);

  return (
    <article className="article article_paseka">
      <div className="article__content article__content_paseka">
        <div className="article__content-left">
          <h1
            className="article__title article__title_paseka"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div
            className="article__content-text article__content-text_paseka"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
          <a
            className="paseka-participation-btn"
            href="https://paseka.te-st.org/apply/"
            target="_blank"
            rel="noreferrer"
          >
            Присоединиться
          </a>
        </div>
        <div className="article__content-right">
          <img
            ref={pasechnikImageRef}
            className={`pasechnik-image${isPasechnikImageShown ? " pasechnik-image_active" : ""}`}
            src={PasechnikImage}
            alt="Пасечник"
          />
        </div>
      </div>
    </article>
  );
};

export default Paseka;
