import React, {Component, useEffect} from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useStoreState, useStoreActions } from "easy-peasy"

import iconApproved from '../../img/icon-all-done.svg'
import metaIconPaseka from '../../img/icon-paseka.svg'

import { getTaskLazyQuery } from '../network'
import * as utils from "../utils"

export function UserSmallPicView({user}) {
    if(!user) {
        return null
    }

    return (
        <div className="itv-user-small-view">
            <span className="avatar-wrapper" style={{
                backgroundImage: user.itvAvatar ? `url(${user.itvAvatar})` : "none",
            }}/>
        </div>
    )
}
