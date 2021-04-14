import { action, thunk } from "easy-peasy";
import {
  IUserNotifState,
  IUserNotifModel,
  IUserNotifActions,
  IFetchResult,
  IStoreModel,
  IRestApiResponse,
} from "./model.typing";
import * as utils from "../utilities/utilities";

const userNotifState: IUserNotifState = {
  notifList: null,
};

const userNotifActions: IUserNotifActions = {
  initializeState: action(prevState => {
    Object.assign(prevState, userNotifState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setNotifList: action((state, payload) => {
    state.notifList = payload;
  }),
  prependNotifList: action((state, payload) => {
    if (state.notifList === null) {
      state.notifList = payload;
    } else {
      state.notifList = [...payload, ...state.notifList];
    }
  }),
  loadNotifList: thunk(actions => {
    const action = "get_user_notif_short_list";
    utils.tokenFetch(utils.getAjaxUrl(action), {
      method: "get",
    })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "error") {
            return utils.showAjaxError({ message: result.message });
          }

          actions.setNotifList(result.notifList);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }),
  loadFreshNotifList: thunk((actions, payload, { getStoreState }) => {
    const {
      components: {
        userNotif: { notifList },
      },
    } = getStoreState() as IStoreModel;

    const action = "get_user_notif_short_list";
    let requestUrl = utils.getAjaxUrl(action);
    if (notifList && notifList.length > 0) {
      requestUrl += "&newer_than_id=" + notifList[0].id;
    }

    utils.tokenFetch(requestUrl, {
      method: "get",
    })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "error" || result.status == "fail") {
            return utils.showAjaxError({ message: result.message });
          } else if (result.notifList) {
            actions.prependNotifList(result.notifList);
          }
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }),
  removeNotifFromList: action((state, payload) => {
    state.notifList = state.notifList.filter(item => item.id !== payload.id);
  }),
  setIsReadRequest: thunk(async ({ setState }, payload, { getStoreState }) => {
    const {
      session: { user },
      components: {
        userNotif: { notifList },
      },
    } = getStoreState() as IStoreModel;
    const id = [];

    notifList.forEach(notif => {
      if (notif.is_read === "0" && Number(notif.user_id) === user.databaseId) {
        id.push(notif.id);
      }
    });

    if (id.length === 0) return;

    try {
      const isReadRequestUrl = new URL(utils.getRestApiUrl(`/itv/v1/user-notif`));
      const isReadRequestParams = {
        id,
        user_id: user.databaseId,
      };
      const isReadResponse = await utils.tokenFetch(isReadRequestUrl.toString(), {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isReadRequestParams),
      });
      const response: IRestApiResponse = await isReadResponse.json();

      if (response.data?.status && response.data.status !== 200) {
        console.error(response.message);
      } else if (response.data?.notifList instanceof Array && response.data.notifList.length > 0) {
        setState({
          notifList: notifList.map(notif => {
            let isReadState: "0" | "1";

            if (
              response.data.notifList.some(({ id, is_read }) => {
                if (id === notif.id) {
                  isReadState = is_read ? "1" : "0";

                  return true;
                }

                return false;
              })
            ) {
              notif.is_read = isReadState;
            }

            return notif;
          }),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }),
};

const userNotifModel: IUserNotifModel = { ...userNotifState, ...userNotifActions };

export default userNotifModel;
