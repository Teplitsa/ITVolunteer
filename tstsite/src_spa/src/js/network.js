import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const USER_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        userId
        username
        profileURL
        fullName
        avatar {
          url
        }
    }
}`

export const TASK_AUTHOR_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        userId
        username
        fullName
        organizationName
        organizationDescription
        organizationLogo
        authorReviewsCount
        profileURL

        avatar {
          url
        }
    }
}`

export const TASK_DOERS_QUERY = gql`
query TaskDoers ($taskId: ID!) {
    taskDoers(taskId: $taskId) {
        userId
        username
        fullName
        solvedTasksCount
        doerReviewsCount
        profileURL
        avatar {
          url
        }
    }
}`

export const TASK_COMMENTS_QUERY = gql`
fragment CommentFields on Comment {
  commentId
  content
  date
  author {
    ... on User {
      id
      email
      avatar {
        url
      }
    }
  }
}

query Comments ($taskId: ID!) {
  comments(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
    nodes {
      ...CommentFields
      replies: children {
        nodes {
          ...CommentFields
          replies: children {
            nodes {
              ...CommentFields
              replies: children {
                nodes {
                  ...CommentFields
                  replies: children {
                    nodes {
                      ...CommentFields
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
}`


export const TASK_QUERY = gql`
query Task($taskId: ID!) {
    task(id: $taskId, idType: DATABASE_ID) {
        databaseId
        title
        content
        date
        viewsCount
        doerCandidatesCount
        
        featuredImage {
            sourceUrl(size: LARGE)
        }        

        tags {
          nodes {
            databaseId
            name
            slug
          }
        }
        rewardTags {
          nodes {
            databaseId
            name
            slug
          }
        }
        ngoTaskTags {
            nodes {
            databaseId
            name
            slug
          }
        }

    }
}`