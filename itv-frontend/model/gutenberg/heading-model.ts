export const queriedFields: string = `
... on CoreHeadingBlock {
    __typename
    attributes {
      ... on CoreHeadingBlockAttributes {
        level
        content
      }
    }
}`;
