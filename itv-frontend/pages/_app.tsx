import "../assets/sass/main.scss";
import { AppProps } from "next/app";
import { ReactElement, useEffect } from "react";
import { Store, createStore, StoreProvider as Provider } from "easy-peasy";
import storeModel from "../model/store-model";
import { componentList } from "../model/components-model";

export const store: Store = createStore(storeModel, {
  name: "ITVAppStore",
  devTools: true,
});

const ITVApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const { dispatch } = store;
  const {
    app,
    entrypointType,
    entrypoint: { archive = null, page = null },
    ...component
  } = pageProps;
  const archiveEntrypoint: string | boolean =
    archive && `archive/${entrypointType}`;
  const pageEntrypoint: string | boolean =
    page && `${entrypointType}/${page.slug}`;
  const [componentName] = Object.keys(component);

  dispatch({
    type: "@action.app.setState",
    payload: {
      ...app,
      ...{
        componentsLoaded: {
          ...app.componentsLoaded,
          [componentName]: {
            at: new Date().toISOString(),
            entrypoint: archiveEntrypoint || pageEntrypoint || "",
          },
        },
      },
    },
  });
  dispatch({
    type: `@action.page.${page ? "setState" : "initializeState"}`,
    payload: page || null,
  });
  dispatch({
    type: `@action.archive.${archive ? "setState" : "initializeState"}`,
    payload:
      (archive && {
        entrypoint: archiveEntrypoint,
        hasNextPage: archive.pageInfo.hasNextPage,
        lastViewedListItem: archive.pageInfo.endCursor,
      }) ||
      null,
  });
  dispatch({
    type: `@action.components.${componentName}.setState`,
    payload: component[componentName],
  });

  useEffect(() => {
    componentList
      .filter((excludeComponentName) => excludeComponentName !== componentName)
      .forEach((excludeComponentName) => {
        dispatch({
          type: `@action.components.${excludeComponentName}.initializeState`,
        });
      });
  }, [componentName]);

  useEffect(() => {
    console.log("Check for client-side storage and update store.");
  }, []);

  return (
    <Provider store={store}>
      <Component {...component[componentName]} />
    </Provider>
  );
};

export default ITVApp;
