import { ReactElement } from "react";

/**
 * Gutenberg
 */

export type CoreBlockTypes =
  | "CoreParagraphBlock"
  | "CoreHeadingBlock"
  | "CoreMediaTextBlock";

export interface ICoreBlock {
  __typename: CoreBlockTypes;
}

export interface ICoreHeadingBlock extends ICoreBlock {
  attributes: {
    level: number;
    content: string;
  };
  className?: Array<string>;
}

export interface ICoreParagraphBlock extends ICoreBlock {
  attributes: {
    content: string;
  };
}

export interface ICoreMediaTextBlock extends ICoreBlock {
  attributes: {
    mediaUrl: string;
    mediaAlt: string;
  };
  innerBlocks: Array<
    ICoreHeadingBlock | ICoreParagraphBlock | ICoreMediaTextBlock
  >;
  classList?: {
    item?: Array<string>;
    media?: Array<string>;
    image?: Array<string>;
    text?: Array<string>;
    title?: Array<string>;
    content?: Array<string>;
  };
  slideInFrom?: "left" | "right";
  include?: {
    before?: ReactElement;
    after?: ReactElement;
  }
}
