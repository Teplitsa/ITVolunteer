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
    approvedDoer: {},
    setDoers: action((state, payload) => {
        state.doers = payload
    }),
    setData: action((state, payload) => {
        state.data = payload
    }),
    setAuthor: action((state, payload) => {
        state.author = payload
    }),
    setApprovedDoer: action((state, payload) => {
        state.approvedDoer = payload
    }),
}

export const storeModel = {
    user: userStoreModel,
    task: taskModel,
}