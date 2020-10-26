import { ReactElement, SyntheticEvent, useRef } from "react";
import Link from "next/link";
import { useStoreActions } from "../../model/helpers/hooks";

const MemberAccountEmptySection: React.FunctionComponent<any> = ({
  title,
  text,
  linkUrl,
  linkCaption,
}): ReactElement => {
  return (
    <div className="member-account-null__empty-section">
      <h3>{title}</h3>
      <div className="empty-section__content">
        {text.split("\n").map((line, index) => <p key={index}>{line}</p>)}
        <Link href={linkUrl}>
          <a>{linkCaption}</a>
        </Link>
      </div>
    </div>
  );
};

export default MemberAccountEmptySection;
