import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

export const USER_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        id
        userId
        username
        profileURL
        fullName
        memberRole
        itvAvatar
    }
}`

export const TASK_AUTHOR_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        id
        userId
        username
        fullName
        organizationName
        organizationDescription
        organizationLogo
        authorReviewsCount
        profileURL
        memberRole
        itvAvatar
    }
}`

export const TASK_DOERS_QUERY = gql`
query TaskDoers ($taskId: ID!) {
    taskDoers(taskId: $taskId) {
        id
        userId
        username
        fullName
        solvedTasksCount
        doerReviewsCount
        profileURL
        memberRole
        itvAvatar
        email
    }
}`

export const TASK_COMMENTS_QUERY = gql`
fragment TaskCommentFields on ItvComment {
  id
  commentId
  content
  date
  author {
    ... on CommentAuthor {
      id
      fullName
      itvAvatar
    }
    ... on User {
      id
      fullName
      itvAvatar
      memberRole
      profileURL
    }
  }
}

query TaskComments ($taskId: ID!) {
  itvComments(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
    nodes {
      ...TaskCommentFields
      replies: children {
        nodes {
          ...TaskCommentFields
          replies: children {
            nodes {
              ...TaskCommentFields
              replies: children {
                nodes {
                  ...TaskCommentFields
                  replies: children {
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
}`

export const TASK_QUERY = gql`
query Task($taskId: ID!) {
    task(id: $taskId, idType: DATABASE_ID) {
        id
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