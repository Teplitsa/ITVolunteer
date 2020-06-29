import { ReactElement, createElement } from "react";
import {
  ICoreBlockTypes,
  ICoreHeadingBlock,
  ICoreParagraphBlock,
  ICoreMediaTextBlock,
} from "../../../model/gutenberg/gutenberg.typing";
import CoreHeadingBlock from "../CoreHeadingBlock";
import CoreParagraphBlock from "../CoreParagraphBlock";
import CoreMediaTextBlock from "../CoreMediaTextBlock";

const blocks = {
  CoreHeadingBlock,
  CoreParagraphBlock,
  CoreMediaTextBlock,
};

const withGutenbergBlock = ({
  elementName,
  props,
}: {
  elementName: ICoreBlockTypes;
  props: any;
}): ReactElement => {
  return createElement<
    ICoreHeadingBlock | ICoreParagraphBlock | ICoreMediaTextBlock
  >(blocks[elementName] || CoreParagraphBlock, props);
};

export default withGutenbergBlock;
