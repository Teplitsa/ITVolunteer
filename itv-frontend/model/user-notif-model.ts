import { action, thunk } from "easy-peasy";
import {
  IUserNotifState,
  IUserNotifModel,
  IUserNotifActions,
  IFetchResult,
} from "./model.typing";
import * as utils from "../utilities/utilities"
import * as _ from "lodash"

const userNotifState: IUserNotifState = {
  notifList: null,
};

const userNotifActions: IUserNotifActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, userNotifState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setNotifList: action((state, payload) => {
      state.notifList = payload
  }),
  loadNotifList: thunk((actions, payload) => {
      let action = 'get_user_notif_short_list'
      fetch(utils.getAjaxUrl(action), {
          method: 'get',
      })
      .then(res => {
          try {
              return res.json()
          } catch(ex) {
              utils.showAjaxError({action, error: ex})
              return {}
          }
      })
      .then(
          (result: IFetchResult) => {
              if(result.status == 'error') {
                  return utils.showAjaxError({message: result.message})
              }

              actions.setNotifList(result.notifList)
          },
          (error) => {
              utils.showAjaxError({action, error})
          }
      )
  }),
  removeNotifFromList: action((state, payload) => {
      state.notifList = state.notifList.filter((item) => item.id !== payload.id)
  }),
};

const userNotifModel: IUserNotifModel = { ...userNotifState, ...userNotifActions };

export default userNotifModel;
