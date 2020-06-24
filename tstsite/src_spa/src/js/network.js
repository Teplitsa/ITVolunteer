import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import React from 'react'

export const USER_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId) {
        id
        databaseId
        username
        name
        fullName
        profileURL
        memberRole
        itvAvatar

        authorReviewsCount
        solvedTasksCount
        doerReviewsCount

        isPasekaMember
        isPartner
    }
}
`
export const TASK_AUTHOR_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId) {
        id
        databaseId
        username
        name
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

        isPasekaMember
        isPartner
    }
}
`
export const getTaskAuthorQuery = (userId) => {
    return useQuery(TASK_AUTHOR_QUERY, {
        skip: !userId,
        variables: {
            userId,
        },
    })
}


export const TASK_DOERS_QUERY = gql`
query TaskDoers ($taskGqlId: ID!) {
    taskDoers(taskGqlId: $taskGqlId) {
        id
        databaseId
        username
        name
        fullName
        profileURL
        memberRole
        itvAvatar

        authorReviewsCount
        solvedTasksCount
        doerReviewsCount

        isPasekaMember
        isPartner
    }
}
`
export const getTaskDoersQuery = (taskGqlId) => {
    return useQuery(TASK_DOERS_QUERY, {
        skip: !taskGqlId,
        variables: {
            taskGqlId,
        },
    })
}


export const TASK_COMMENTS_QUERY = gql`
fragment TaskCommentFields on Comment {
  id
  content
  date
  dateGmt
  likesCount
  likeGiven
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

query TaskComments ($taskId: ID) {
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
}
`
export const getTaskCommentsQuery = (taskId) => {
    return useQuery(TASK_COMMENTS_QUERY, {
        variables: {
            taskId,
        },
    })
}


export const TASK_QUERY = gql`
query Task($taskGqlId: ID!) {
    task(id: $taskGqlId) {
        id
        databaseId
        title
        slug
        content
        date
        dateGmt
        viewsCount
        doerCandidatesCount
        status
        reviewsDone
        nextTaskSlug

        approvedDoer {
          id
          databaseId
          fullName
          itvAvatar
          memberRole
          profileURL

          authorReviewsCount
          solvedTasksCount
          doerReviewsCount
        }
        
        author {
          id
          databaseId
          fullName
          itvAvatar
          memberRole
          profileURL
        }
        
        featuredImage {
            sourceUrl(size: LARGE)
        }        

        tags {
          nodes {
            id
            name
            slug
          }
        }
        rewardTags {
          nodes {
            id
            name
            slug
          }
        }
        ngoTaskTags {
          nodes {
            id
            name
            slug
          }
        }

    }
}
`
export const getTaskQuery = (taskGqlId) => {
    return useQuery(TASK_QUERY, {
        variables: {
            taskGqlId,
        },
    })
}
export const getTaskLazyQuery = (taskGqlId) => {
    return useLazyQuery(TASK_QUERY, {
        variables: {
            taskGqlId,
        },
        fetchPolicy: "network-only",
    })
}


export const TASK_BY_SLUG_QUERY = gql`
query Task($taskSlug: ID!) {
    task(id: $taskSlug, idType: SLUG) {
        id
        databaseId
        title
        slug
        content
        date
        dateGmt
        viewsCount
        doerCandidatesCount
        status
        reviewsDone
        nextTaskSlug

        approvedDoer {
          id
          databaseId
          fullName
          itvAvatar
          memberRole
          profileURL

          authorReviewsCount
          solvedTasksCount
          doerReviewsCount
        }
        
        author {
          id
          databaseId
          fullName
          itvAvatar
          memberRole
          profileURL
        }
        
        featuredImage {
            sourceUrl(size: LARGE)
        }        

        tags {
          nodes {
            id
            name
            slug
          }
        }
        rewardTags {
          nodes {
            id
            name
            slug
          }
        }
        ngoTaskTags {
          nodes {
            id
            name
            slug
          }
        }

    }
}
`
export const getTaskBySlugQuery = (taskSlug) => {
    return useQuery(TASK_BY_SLUG_QUERY, {
        variables: {
            taskSlug,
        },
    })
}