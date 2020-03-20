import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import React from 'react'

export const USER_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        id
        userId
        databaseId
        username
        fullName
        profileURL
        memberRole
        itvAvatar

        authorReviewsCount
        solvedTasksCount
        doerReviewsCount
    }
}`

export const TASK_AUTHOR_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        id
        userId
        databaseId
        username
        fullName
        profileURL
        memberRole
        itvAvatar

        organizationName
        organizationDescription
        organizationLogo

        authorReviewsCount
        solvedTasksCount
        doerReviewsCount
    }
}`

export const getTaskAuthorQuery = (userId) => {
    return useQuery(TASK_AUTHOR_QUERY, {
        variables: {
            userId,
        },
    })
}

export const TASK_DOERS_QUERY = gql`
query TaskDoers ($taskId: ID!) {
    taskDoers(taskId: $taskId) {
        id
        userId
        databaseId
        username
        fullName
        profileURL
        memberRole
        itvAvatar

        authorReviewsCount
        solvedTasksCount
        doerReviewsCount
    }
}`

export const TASK_COMMENTS_QUERY = gql`
fragment TaskCommentFields on Comment {
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
  comments(where: {contentId: $taskId, orderby: COMMENT_DATE, order: ASC}) {
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

export const getTaskQuery = (taskId) => {
    return useQuery(TASK_QUERY, {
        variables: {
            taskId,
        },
    })
}