import { ReactElement } from "react";
import { ICoreParagraphBlock } from "../../model/gutenberg/gutenberg.typing";

const CoreParagraphBlock: React.FunctionComponent<ICoreParagraphBlock> = ({
  attributes: { content },
}): ReactElement => {
  return <p dangerouslySetInnerHTML={{ __html: content }} />;
};

export default CoreParagraphBlock;
