import { IAppModel, IAppState, IAppActions } from "./model.typing";
import { action } from "easy-peasy";

const appState: IAppState = {
  componentsLoaded: {},
  menus: {
    social: []
  }
};

export const graphqlQuery = {
  getMenusByLocation: `
  query GetMenusByLocation($location: MenuLocationEnum!) {
    menuItems(where: {location: $location}) {
      nodes {
        id
        url
        label
      }
    }
  }`
};

const appActions: IAppActions = {
  setState: action((prevState, newState) => {
    Object.assign(prevState, newState);
  }),
};

const appModel: IAppModel = { ...appState, ...appActions };

export default appModel;