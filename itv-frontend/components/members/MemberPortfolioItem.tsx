import { ReactElement } from "react";
import Link from "next/link";

const MemberPortfolioItem: React.FunctionComponent<{
  userSlug: string;
  slug: string;
  title: string;
  preview: string;
}> = ({ userSlug, slug, title, preview }): ReactElement => {
  return (
    <div className="member-portfolio__list-item">
      <Link href="/members/[username]/[portfolio_item_slug]" as={`/members/${userSlug}/${slug}`}>
        <a>
          <span style={{ backgroundImage: `url(${preview})` }} className="member-portfolio__list-item-preview" />
        </a>
      </Link>
      <div className="member-portfolio__list-item-title">
        <Link href="/members/[username]/[portfolio_item_slug]" as={`/members/${userSlug}/${slug}`}>
          <a dangerouslySetInnerHTML={{ __html: title }} />
        </Link>
      </div>
    </div>
  );
};

export default MemberPortfolioItem;
