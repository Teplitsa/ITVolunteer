import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import MemberAvatar from "../MemberAvatar";

const MemberCardSmallBage: React.FunctionComponent = (): ReactElement => {
  const {
    itvAvatar: memberAvatar,
    fullName: memberFullName,
    itvRoleTitle: memberRole,
  } = useStoreState(store => store.components.portfolioItem.author);

  return (
    <div className="member-card-small__bage">
      <div className="member-card-small__avatar">
        <MemberAvatar {...{ memberAvatar, memberFullName, size: "medium-plus" }} />
      </div>
      <div className="member-card-small__name">{memberFullName}</div>
      <div className="member-card-small__role">{memberRole}</div>
    </div>
  );
};

export default MemberCardSmallBage;
