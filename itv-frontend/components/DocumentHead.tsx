import Head from "next/head";
import { ReactElement } from "react";
import { useStoreState } from "../model/helpers/hooks";
import Favicon from "../assets/img/favicon.svg";

const DocumentHead: React.FunctionComponent = (): ReactElement => {
  const seo = useStoreState(({ app: { entrypointTemplate }, entrypoint }) => {
    return entrypoint[entrypointTemplate]?.seo;
  });

  if (!seo) return null;

  const {
    canonical,
    title,
    focuskw,
    metaDesc,
    metaRobotsNoindex,
    metaRobotsNofollow,
    opengraphAuthor,
    opengraphPublishedTime,
    opengraphModifiedTime,
    opengraphTitle,
    opengraphUrl,
    opengraphSiteName,
    opengraphDescription,
    opengraphImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = seo;

  return (
    <Head>
      <title>{title}</title>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      {focuskw && <meta name="keywords" content={focuskw} />}
      {metaDesc && <meta name="description" content={metaDesc} />}
      {(metaRobotsNoindex || metaRobotsNofollow) && (
        <meta
          name="robots"
          content={[metaRobotsNoindex, metaRobotsNofollow].join(",")}
        />
      )}
      {opengraphTitle && <meta property="og:type" content="article" />}
      {opengraphAuthor && (
        <meta property="article:author" content={opengraphAuthor} />
      )}
      {opengraphPublishedTime && (
        <meta
          property="article:published_time"
          content={opengraphPublishedTime}
        />
      )}
      {opengraphModifiedTime && (
        <meta
          property="article:published_time"
          content={opengraphModifiedTime}
        />
      )}

      {opengraphTitle && <meta property="og:title" content={opengraphTitle} />}
      {opengraphUrl && <meta property="og:url" content={opengraphUrl} />}
      {opengraphSiteName && (
        <meta property="og:site_name" content={opengraphSiteName} />
      )}
      {opengraphDescription && (
        <meta property="og:description" content={opengraphDescription} />
      )}
      {opengraphImage?.sourceUrl && (
        <meta property="og:image" content={opengraphImage.sourceUrl} />
      )}
      {opengraphImage?.altText && (
        <meta property="og:image:alt" content={opengraphImage.altText} />
      )}
      {twitterTitle && (
        <meta name="twitter:card" content="summary_large_image" />
      )}
      {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
      {twitterDescription && (
        <meta name="twitter:description" content={twitterDescription} />
      )}
      {twitterImage?.sourceUrl && (
        <meta name="twitter:image" content={twitterImage.sourceUrl} />
      )}
      {twitterImage?.altText && (
        <meta name="twitter:image:alt" content={twitterImage.altText} />
      )}
      {canonical && <link rel="canonical" href={canonical} />}
      {Favicon && (
        <link rel="icon" href={Favicon} sizes="any" type="image/svg+xml" />
      )}
    </Head>
  );
};

export default DocumentHead;
