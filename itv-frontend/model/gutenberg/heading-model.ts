export const queriedFields: string = `
... on CoreHeadingBlock {
    attributes {
      ... on CoreHeadingBlockAttributes {
        level
        content
      }
    }
}`;
