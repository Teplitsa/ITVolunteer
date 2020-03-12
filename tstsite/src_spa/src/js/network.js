import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const USER_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        databaseId
        username
        avatar {
          url
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