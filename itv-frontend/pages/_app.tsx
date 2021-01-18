import "../assets/sass/main.scss";
import "react-datepicker/dist/react-datepicker.css";
import { AppProps } from "next/app";
import { ReactElement, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Store, createStore, StoreProvider as Provider } from "easy-peasy";
import storeModel from "../model/store-model";
import withSkeleton from "../components/hoc/withSkeleton";
// import { componentList } from "../model/components-model";

export const store: Store = createStore(storeModel, {
  name: "ITVAppStore",
  devTools: true,
});

const ITVApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const { dispatch } = store;
  const {
    statusCode,
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

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [Skeleton, setSkeleton] = useState(null);

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
    type: `@action.entrypoint.page.${page ? "setState" : "initializeState"}`,
    payload: page || null,
  });
  dispatch({
    type: `@action.entrypoint.archive.${
      archive ? "setState" : "initializeState"
    }`,
    payload:
      (archive && {
        entrypoint: archiveEntrypoint,
        hasNextPage: archive.pageInfo.hasNextPage,
        lastViewedListItem: archive.pageInfo.endCursor,
        seo: archive.seo,
      }) ||
      null,
  });
  dispatch({
    type: `@action.components.${componentName}.setState`,
    payload: component[componentName],
  });

  // useEffect(() => {
  //   componentList
  //     .filter((excludeComponentName) => excludeComponentName !== componentName)
  //     .forEach((excludeComponentName) => {
  //       dispatch({
  //         type: `@action.components.${excludeComponentName}.initializeState`,
  //       });
  //     });
  // }, [componentName]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if(isPageWithSkeleton(url)) {
        setIsLoading(true);
        setSkeleton(() => withSkeleton({ pathname: url }));
      }
    };

    const handleRouteChanged = (url: string) => {
      // reset breadcrumbs
      dispatch({
        type: `@action.components.breadCrumbs.initializeState`,
      });
      
      if(isPageWithSkeleton(url)) {
        setIsLoading(false);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChanged);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChanged);
    };
  }, []);

  return (
    <Provider store={store}>
      {(isLoading && !Object.is(Skeleton, null) && <Skeleton />) || (
        <Component {...component[componentName]} statusCode={statusCode} />
      )}
    </Provider>
  );
};

function isPageWithSkeleton(pathname) {
  return pathname.search(/^\/$/i) !== -1 
    || pathname.search(/^\/members$/i) !== -1
    || pathname.search(/^\/members\/[^/]+$/i) !== -1
    || pathname.search(/^\/members\/[^/]+\/[^/]+$/i) !== -1
    || pathname.search(/^\/tasks$/i) !== -1
    || pathname.search(/^\/tasks\/\S+$/i) !== -1;
}

export default ITVApp;
