import Head from "next/head";
import { ReactElement } from "react";
import { useStoreState } from "../model/helpers/hooks";

const DocumentHead: React.FunctionComponent = (): ReactElement => {
  const title = "";
  const meta = null;

  return (
    <Head>
      <title>{title}</title>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      {meta?.keywords && <meta name="keywords" content={meta.keywords} />}
      {meta?.description && <meta name="description" content={meta.keywords} />}
    </Head>
  );
};

export default DocumentHead;
