import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import MemberAvatar from "../MemberAvatar";

const MemberCardSmallBage: React.FunctionComponent = (): ReactElement => {
  const {
    slug: memberSlug,
    itvAvatar: memberAvatar,
    fullName: memberFullName,
    itvRoleTitle: memberRole,
    isPasekaMember,
    partnerIcon,
  } = useStoreState(store => store.components.portfolioItem.author);

  return (
    <div className="member-card-small__bage">
      <div className="member-card-small__avatar">
        <MemberAvatar {...{ memberAvatar, memberFullName, size: "medium-plus", isPasekaMember, partnerIcon, }} />
      </div>
      <div className="member-card-small__name">
        <Link href="/members/[username]" as={`/members/${memberSlug}`}>
          {memberFullName}
        </Link>
      </div>
      <div className="member-card-small__role">{memberRole}</div>
    </div>
  );
};

export default MemberCardSmallBage;
