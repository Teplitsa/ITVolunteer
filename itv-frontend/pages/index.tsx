import { ReactElement } from "react";
import Head from "next/head";

function Home(): ReactElement {

  return (
    <div className="container">
      ITV index
    </div>
  );
}

Home.getInitialProps = (ctx) => {
  return {
    app: {
      componentsLoaded: [],
    },
    entrypointType: null,
    entrypoint: { archive: null, page: null },
  }
}

export default Home;