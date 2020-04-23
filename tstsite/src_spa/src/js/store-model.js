import React from 'react'
import { action, computed, thunk, thunkOn, actionOn } from "easy-peasy";
import * as utils from "./utils"

var storeJsLocalStorage = require('store')

const userStoreModel = {
    data: {},
    isLoaded: false,
    setUserData: action((state, payload) => {
        state.data = payload
        state.isLoaded = true
    }),

    // subscribe task list
    subscribeTaskList: null,
    setSubscribeTaskList: action((state, payload) => {
        state.subscribeTaskList = payload
    }),
    loadSubscribeTaskList: thunk((actions, payload) => {
        let action = 'get-task-list-subscription'
        fetch(utils.itvAjaxUrl(action), {
            method: 'get',
        })
        .then(res => {
            try {
                return res.json()
            } catch(ex) {
                utils.itvShowAjaxError({action, error: ex})
                return {}
            }
        })
        .then(
            (result) => {
                if(result.status == 'fail') {
                    return utils.itvShowAjaxError({message: result.message})
                }

                actions.setSubscribeTaskList(result.filter)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
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

    isUserCandidate: computed(state => (user) => {
        return !!user.id && state.doers.find((doer) => doer.id == user.id)
    }),

    setDoers: action((state, payload) => {
        state.doers = payload
    }),
    addDoer: action((state, payload) => {
        state.doers.push(payload)
    }),
    setData: action((state, payload) => {
        if(!payload) {
            return
        }
        
        state.data = payload
        if(payload.approvedDoer) {
            state.approvedDoer = payload.approvedDoer
        }
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

        if(!state.comments) {
            return
        }

        function operateComment(comment1) {
            if(!comment1) {
                return
            }

            state.commentsLikesCount[comment1.id] = comment1.likesCount

            comment1.replies.nodes.forEach((comment2) => {
                operateComment(comment2)
            })
        }

        state.comments.nodes.forEach((comment3) => {
            operateComment(comment3)
        })
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
    commentsLikesCount: {},
    setCommentLikesCount: action((state, payload) => {
        state.commentsLikesCount[payload.commentId] = payload.likesCount
    }),
    // reviews
    reviewForDoer: null,
    setReviewForDoer: action((state, payload) => {
        state.reviewForDoer = payload
    }),
    reviewForAuthor: null,
    setReviewForAuthor: action((state, payload) => {
        state.reviewForAuthor = payload
    }),
}

const timelineModel = {
    timeline: [],
    isLoaded: false,
    setTimeline: action((state, payload) => {
        state.timeline = payload
        state.isLoaded = true
    }),
    loadTimeline: thunk((actions, payload) => {
        let formData = new FormData()
        formData.append('task_gql_id', payload)

        let action = 'get-task-timeline'
        fetch(utils.itvAjaxUrl(action), {
            method: 'post',
            body: formData,
        })
        .then(res => {
            try {
                return res.json()
            } catch(ex) {
                utils.itvShowAjaxError({action, error: ex})
                return {}
            }

            actions.setUserLoaded(true)
        })
        .then(
            (result) => {
                if(result.status == 'error') {
                    return utils.itvShowAjaxError({message: result.message})
                }

                actions.setTimeline(result.timeline)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }),
}

const taskListModel = {
    taskList: [],
    isTaskListLoaded: false,
    setTaskList: action((state, payload) => {
        state.taskList = payload
        state.isTaskListLoaded = true
    }),    
    appendTaskList: action((state, payload) => {
        state.taskList = [...state.taskList, ...payload]
    }),
    resetTaskListLoaded: action((state, payload) => {
        state.isTaskListLoaded = false
    }),
}

const taskListFilterModel = {
    // tips
    tipClose: {},
    setTipClose: action((state, payload) => {
        state.tipClose = payload ? payload : {}
        // console.log("set state.tipClose:", state.tipClose)
    }),
    loadTipClose: thunk((actions, payload) => {
        actions.setTipClose(storeJsLocalStorage.get('taskFilter.tipClose'))
    }),    
    saveTipClose: action((state, payload) => {
        // console.log("save state:", state)
        storeJsLocalStorage.set('taskFilter.tipClose', state.tipClose)
    }),

    // section open
    sectionClose: {},
    setSectionClose: action((state, payload) => {
        state.sectionClose = payload ? payload : {}
        // console.log("set state.setSectionClose:", state.setSectionClose)
    }),
    loadSectionClose: thunk((actions, payload) => {
        actions.setSectionClose(storeJsLocalStorage.get('taskFilter.setSectionClose'))
    }),    
    saveSectionClose: action((state, payload) => {
        // console.log("save state:", state)
        storeJsLocalStorage.set('taskFilter.setSectionClose', state.setSectionClose)
    }),

    // option checked
    optionCheck: null,
    setOptionCheck: action((state, payload) => {
        state.optionCheck = payload
    }),
    loadOptionCheck: thunk((actions, payload) => {
        let optionCheck = storeJsLocalStorage.get('taskFilter.optionCheck')
        actions.setOptionCheck(_.isEmpty(optionCheck) ? {} : optionCheck)
    }),    
    saveOptionCheck: action((state, payload) => {
        storeJsLocalStorage.set('taskFilter.optionCheck', state.optionCheck)
    }),

    // status stats
    statusStats: null,
    setStatusStats: action((state, payload) => {
        state.statusStats = payload
    }),

    // load filter
    filterData: [],
    isFilterDataLoaded: false,
    setFilterData: action((state, payload) => {
        state.filterData = payload ? payload : []
        state.isFilterDataLoaded = true
        // console.log("set state.filterData:", state.filterData)
    }),
    loadFilterData: thunk((actions, payload) => {
        let action = 'get-task-list-filter'
        fetch(utils.itvAjaxUrl(action), {
            method: 'get',
        })
        .then(res => {
            try {
                return res.json()
            } catch(ex) {
                utils.itvShowAjaxError({action, error: ex})
                return {}
            }
        })
        .then(
            (result) => {
                if(result.status == 'error') {
                    return utils.itvShowAjaxError({message: result.message})
                }

                actions.setFilterData(result.sections)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }),    
}

export const storeModel = {
    user: userStoreModel,
    task: taskModel,
    timeline: timelineModel,
    taskList: taskListModel,
    taskListFilter: taskListFilterModel,
}