import { ReactElement } from "react";
import { ICoreMediaTextBlock } from "../../model/gutenberg/gutenberg.typing";
import withGutenbergBlock from "../gutenberg/helpers/withGutenbergBlock";
import withSlideIn from "../hoc/withSlideIn";

const Image: React.FunctionComponent<{
  mediaUrl: string;
  mediaAlt?: string;
  className?: string;
}> = ({ mediaUrl, mediaAlt = "", className = "media-image" }): ReactElement => {
  return <img className={className} src={mediaUrl} alt={mediaAlt} />;
};

const CoreMediaTextBlock: React.FunctionComponent<ICoreMediaTextBlock> = ({
  attributes: { mediaUrl, mediaAlt },
  innerBlocks,
  classList,
  slideInFrom,
  include,
}): ReactElement => {
  const ImageWithAttributes: React.FunctionComponent = (): ReactElement => (
    <Image
      {...{ mediaUrl, mediaAlt, className: classList?.image?.join(" ") }}
    />
  );

  return (
    <div className={classList?.item?.join(" ")}>
      <div className={classList?.media?.join(" ")}>
        {(slideInFrom &&
          withSlideIn({
            component: ImageWithAttributes,
            fullWidth: false,
            from: slideInFrom,
          })) || <ImageWithAttributes />}
      </div>
      <div className={classList?.text?.join(" ")}>
        {innerBlocks?.map(({ __typename: elementName, ...props }, i) => {
          if (elementName === "CoreHeadingBlock") {
            return withGutenbergBlock({
              elementName,
              props: {
                key: `Block-${i}`,
                ...{ className: classList?.title?.join(" "), ...props },
              },
            });
          }
        })}
        <div className={classList?.content?.join(" ")}>
          {include?.before && include.before}
          {innerBlocks?.map(({ __typename: elementName, ...props }, i) => {
            if (elementName !== "CoreHeadingBlock") {
              return withGutenbergBlock({
                elementName,
                props: {
                  key: `Block-${i}`,
                  ...props,
                },
              });
            }
          })}
          {include?.after && include.after}
        </div>
      </div>
    </div>
  );
};

export default CoreMediaTextBlock;
