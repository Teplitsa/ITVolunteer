import { IAppModel, IAppState, IAppActions } from "./model.typing";
import { action } from "easy-peasy";

const appState: IAppState = {
  componentsLoaded: {},
  now: Date.now(),
};

const appActions: IAppActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const appModel: IAppModel = { ...appState, ...appActions };

export default appModel;