import { ReactElement } from "react";
import Link from "next/link";

const MemberPortfolioItem: React.FunctionComponent<{
  username: string;
  slug: string;
  title: string;
  preview: string;
}> = ({ username, slug, title, preview }): ReactElement => {
  return (
    <div className="member-portfolio__list-item">
      <Link href="/members/[username]/[portfolio_item_slug]" as={`/members/${username}/${slug}`}>
        <a>
          <img src={preview} alt="" />
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
