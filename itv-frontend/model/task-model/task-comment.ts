import { ITaskComment, ITaskCommentAuthor } from "../model.typing";

export const findCommentById = (
  commentId: string,
  comments: Array<ITaskComment>
): ITaskComment | undefined => {
  for (let comment of comments) {
    if (comment.id === commentId) {
      return comment;
    } else if (Array.isArray(comment.replies?.nodes)) {
      let commentFound: ITaskComment | undefined = findCommentById(
        commentId,
        comment.replies.nodes
      );
      if (commentFound) {
        return commentFound;
      }
    }
  }
};

const taskComment: ITaskComment = {
  id: "",
  content: "",
  date: "",
  dateGmt: "",
  likesCount: 0,
  likeGiven: false,
  likers: null,
  author: {
    id: "",
    fullName: "",
    itvAvatar: "",
  },
  replies: null,
};

export const queriedFields = Object.keys(taskComment).filter(
  (field) => !["likers", "author", "replies"].includes(field)
) as Array<keyof ITaskComment>;

export const authorQueriedFields = Object.keys(taskComment.author) as Array<
  keyof ITaskCommentAuthor
>;

export const graphqlQuery = {
  commentsRequest: `
    fragment TaskCommentFields on Comment {
        ${queriedFields.join("\n")}
        likers {
          userId
          userName
        }
        author {
            ... on CommentAuthor {
                ${authorQueriedFields.join("\n")}
            }
            ... on User {
                ${authorQueriedFields.join("\n")}
                memberRole
                profileURL
            }
        }
    }
    query TaskComments ($taskId: ID) {
        comments(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
          nodes {
            ...TaskCommentFields
            replies: children(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
              nodes {
                ...TaskCommentFields
                replies: children(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
                  nodes {
                    ...TaskCommentFields
                    replies: children(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
                      nodes {
                        ...TaskCommentFields
                        replies: children(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
                          nodes {
                            ...TaskCommentFields
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
    }`,
};
