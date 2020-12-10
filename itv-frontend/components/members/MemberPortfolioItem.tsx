import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import NoPreview from "../../assets/img/pic-portfolio-item-no-preview.svg";
import { getMediaData } from "../../utilities/media";

const MemberPortfolioItem: React.FunctionComponent<{
  username: string;
  slug: string;
  title: string;
  preview: number;
}> = ({ username, slug, title, preview }): ReactElement => {
  const [previewUrl, setPreviewUrl] = useState<string>(NoPreview);

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   // (async () => {
  //   //   const { mediaItemUrl: previewUrl } = await getMediaData(preview, abortController);

  //   //   setPreviewUrl(previewUrl);
  //   // })();

  //   getMediaData(preview, abortController).then(({ mediaItemUrl: previewUrl }) =>
  //     setPreviewUrl(previewUrl)
  //   );

  //   return () => abortController.abort();
  // }, []);

  return (
    <div className="member-portfolio__list-item">
      <Link href="/members/[username]/[portfolio_item_slug]" as={`/members/${username}/${slug}`}>
        <a>
          <img src={previewUrl} alt="" />
        </a>
      </Link>
      <div className="member-portfolio__list-item-title">
        <Link href="/members/[username]/[portfolio_item_slug]" as={`/members/${username}/${slug}`}>
          <a>{title}</a>
        </Link>
      </div>
    </div>
  );
};

export default MemberPortfolioItem;
