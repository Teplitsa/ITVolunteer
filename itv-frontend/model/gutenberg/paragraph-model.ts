export const queriedFields: string = `
... on CoreParagraphBlock {
    __typename
    attributes {
      ... on CoreParagraphBlockAttributes {
        content
      }
    }
}`;
