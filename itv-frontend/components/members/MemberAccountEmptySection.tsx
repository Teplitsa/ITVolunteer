import { ReactElement } from "react";
import Link from "next/link";
import WomanImage from "../../assets/img/illustration-empty-section-woman.svg";

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
        <img className="empty-section__content-image" src={WomanImage} alt="" />
        <div className="empty-section__content-text" dangerouslySetInnerHTML={{ __html: text }} />
        <Link href={linkUrl}>
          <a>{linkCaption}</a>
        </Link>
      </div>
    </div>
  );
};

export default MemberAccountEmptySection;
