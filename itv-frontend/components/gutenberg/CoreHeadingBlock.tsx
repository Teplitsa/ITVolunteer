import { ReactElement, createElement } from "react";
import { ICoreHeadingBlock } from "../../model/gutenberg/gutenberg.typing";

const CoreHeadingBlock: React.FunctionComponent<ICoreHeadingBlock> = ({
  attributes: { level, content },
  className,
}): ReactElement => {
  return createElement(`h${level}`, { className }, [content]);
};

export default CoreHeadingBlock;
