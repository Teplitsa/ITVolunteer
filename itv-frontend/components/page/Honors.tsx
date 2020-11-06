import { ReactElement, useEffect } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import { useRouter } from "next/router";
import withGutenbergBlock from "../gutenberg/hoc/withGutenbergBlock";
import HonorsListItemIndex from "./HonorsListItemIndex";
import { regEvent } from "../../utilities/ga-events";

const Honors: React.FunctionComponent = (): ReactElement => {
  const router = useRouter();
  const { title, blocks } = useStoreState(state => state.components.honors);
  let mediaTextBlockIndex = -1;

  useEffect(() => {
    regEvent("ge_show_new_desing", router);
  }, [router.pathname]);

  return (
    <article className="article article_honors">
      <h1
        className="article__title article__title_honors"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="article__content">
        <div className="article__content-text article__content-text_honors">
          {blocks?.map(({ __typename: elementName, ...props }, i) => {
            if (elementName === "CoreParagraphBlock") {
              return withGutenbergBlock({
                elementName,
                props: { key: `Block-${i}`, ...props },
              });
            }
          })}
        </div>
        <div className="honors-list">
          {blocks?.map(({ __typename: elementName, ...props }, i) => {
            if (elementName === "CoreMediaTextBlock") {
              mediaTextBlockIndex++;
              return withGutenbergBlock({
                elementName,
                props: {
                  key: `Block-${i}`,
                  classList: {
                    item: ["honors-list__item"],
                    media: ["honors-list__item-media"],
                    image: ["honors-list__item-image"],
                    text: ["honors-list__item-text"],
                    title: ["honors-list__item-title"],
                    content: ["honors-list__item-content"],
                  },
                  slideInFrom: mediaTextBlockIndex % 2 === 0 ? "left" : "right",
                  include: {
                    before: <HonorsListItemIndex {...{ itemIndex: mediaTextBlockIndex }} />,
                  },
                  ...props,
                },
              });
            }
          })}
        </div>
      </div>
    </article>
  );
};

export default Honors;
