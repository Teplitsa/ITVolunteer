import { queriedFields as headingQueriedFields } from "./heading-model";
import { queriedFields as paragraphQueriedFields } from "./paragraph-model";

export const queriedFields: string = `
... on CoreMediaTextBlock {
    __typename
    attributes {
      ... on CoreMediaTextBlockAttributes {
        mediaUrl
        mediaAlt
      }
    }
    innerBlocks {
        __typename
        ${headingQueriedFields}
        ${paragraphQueriedFields}
    }
}`;
