import { action, thunk } from "easy-peasy";
import {
  IUserNotifState,
  IUserNotifModel,
  IUserNotifActions,
  IFetchResult,
  IStoreModel,
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
  prependNotifList: action((state, payload) => {
    if(state.notifList === null) {
      state.notifList = payload
    }
    else {
      state.notifList = [...payload, ...state.notifList]
    }
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
  loadFreshNotifList: thunk((actions, payload, {getStoreState}) => {

      const {
        components: {
          userNotif: { notifList },
        },
      } = getStoreState() as IStoreModel;

      let action = 'get_user_notif_short_list'
      let requestUrl = utils.getAjaxUrl(action)
      if(notifList && notifList.length > 0) {
        requestUrl +=  "&newer_than_id=" + notifList[0].id
      }

      fetch(requestUrl, {
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
              if(result.status == 'error' || result.status == 'fail') {
                  return utils.showAjaxError({message: result.message});
              }
              else if(result.notifList) {
                actions.prependNotifList(result.notifList);
              }
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
