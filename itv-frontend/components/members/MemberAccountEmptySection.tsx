import { ReactElement } from "react";
import Link from "next/link";

const MemberAccountEmptySection: React.FunctionComponent<{
  title: string;
  text: string;
  linkUrl: string;
  linkCaption: string;
}> = ({ title, text, linkUrl, linkCaption }): ReactElement => {
  return (
    <div className="member-account-null__empty-section">
      <h3>{title}</h3>
      <div className="empty-section__content">
        {text.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
        <Link href={linkUrl}>
          <a>{linkCaption}</a>
        </Link>
      </div>
    </div>
  );
};

export default MemberAccountEmptySection;
