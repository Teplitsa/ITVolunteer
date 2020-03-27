import React from 'react'
import { action, computed, thunk, thunkOn, actionOn } from "easy-peasy";
import * as utils from "./utils"

const userStoreModel = {
    data: {},
    isLoaded: false,
    setUserData: action((state, payload) => {
        state.data = payload
        state.isLoaded = true
    }),
}

const taskModel = {
    doers: [],
    data: {},
    author: {},
    comments: null,
    approvedDoer: null,

    userMayAddComment: computed(state => (user) => {
        return !!user.id && ( user.id == state.author.id || state.doers.find((doer) => doer.id == user.id) )
    }),

    setDoers: action((state, payload) => {
        state.doers = payload
    }),
    setData: action((state, payload) => {
        state.data = payload
    }),
    setAuthor: action((state, payload) => {
        state.author = payload
    }),
    approveDoer: action((state, payload) => {
        state.approvedDoer = payload
    }),
    declineDoer: action((state, payload) => {
        state.doers = payload.doers.filter((doer) => payload.doer.id != doer.id)
    }),
    setComments: action((state, payload) => {
        state.comments = payload
    }),
    commentToReply: null,
    setCommentToReply: action((state, payload) => {
        state.commentToReply = payload
    }),
    addCommentForm: null,
    setAddCommentForm: action((state, payload) => {
        state.addCommentForm = payload
    }),
    addComment: action((state, payload) => {
        let parentCommentId = payload.parentCommentId
        let parentComment = null

        console.log("parentCommentId", parentCommentId)

        let iterateComment = (comments) => {
            if(parentComment) {
                return
            }

            comments.nodes.forEach((comment) => {
                console.log("check comment:", comment.id)

                if(comment.id === parentCommentId) {
                    parentComment = comment.replies
                    console.log("parent comment found")
                    return
                }
                iterateComment(comment.replies)
            })
        }

        if(parentCommentId) {
            iterateComment(payload.taskComments)
        }
        else {
            console.log("push to root nodes")
            parentComment = payload.taskComments
        }

        console.log("push to parentComment:", parentComment)

        if(parentComment) {
            parentComment.nodes.push({...payload.comment, replies: {nodes: []}})
            state.comments = {...payload.taskComments}
        }
        
    }),
}

export const storeModel = {
    user: userStoreModel,
    task: taskModel,
}