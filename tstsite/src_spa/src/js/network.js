import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const USER_QUERY = gql`
query User ($userId: ID!) {
    user(id: $userId, idType: DATABASE_ID) {
        id
        userId
        username
        avatar {
          url
        }
    }
}`

export const TASK_QUERY = gql`
query Task($taskId: ID!) {
    task(id: $taskId, idType: DATABASE_ID) {
        id
        taskId
        title
        content
    }
}`