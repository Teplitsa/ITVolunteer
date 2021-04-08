import {
  IHomePageState,
  IHomePageModel,
  IHomePageActions,
  IHomePageThunks,
  IStoreModel,
} from "../model.typing";
import * as utils from "../../utilities/utilities";
import { action, thunk, thunkOn } from "easy-peasy";

const homePageState: IHomePageState = {
  id: "",
  title: "",
  slug: "",
  content: "",
  newsList: null,
  taskList: [],
  stats: null,
};

const homePageActions: IHomePageActions = {
  initializeState: action((prevState) => {
    Object.assign(prevState, homePageState);
  }),
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
  setStats: action((state, payload) => {
    state.stats = payload
  }),
  setTaskList: action((state, payload) => {
    state.taskList = payload;
  }),
  setNewsList: action((state, payload) => {
    state.newsList = {isNewsListLoaded: true, items: payload};
  }),
};

const homePageThunks: IHomePageThunks = {
  loadStatsRequest: thunk(
    async() => {

      try {
        const action = "get-task-status-stats";
        const result = await utils.tokenFetch(utils.getAjaxUrl(action), {
          method: "post",
        });

        const { status: responseStatus, stats: stats } = await (<
          Promise<{
            status: string;
            stats?: any;
          }>
        >result.json());

        if (responseStatus === "ok") {
          return {stats};
        }

      } catch (error) {
        console.error(error);
      }

      return {stats: null};
    }
  ),
  onLoadStatsRequestSuccess: thunkOn(
    (actions) => actions.loadStatsRequest.successType,
    ({ setStats }, { result }) => {
      const {
        stats,
      } = result;

      setStats(stats);
    }
  ),  
};

const homePageModel: IHomePageModel = {
  ...homePageState,
  ...homePageActions,
  ...homePageThunks,
};

export default homePageModel;
