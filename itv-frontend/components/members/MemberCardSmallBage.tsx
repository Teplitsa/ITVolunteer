import { ReactElement } from "react";
// import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberAvatar from "../MemberAvatar";

const MemberCardSmallBage: React.FunctionComponent = (): ReactElement => {
//   const {
//     itvAvatar: memberAvatar,
//     fullName: memberFullName,
//   } = useStoreState(store => store.components.memberAccount);

  return (
    <div className="member-card-small__bage">
      <div className="member-card-small__avatar">
        <MemberAvatar {...{ memberAvatar: "temp-avatar.png", memberFullName: "Алексей Кульпин", size: "medium-plus" }} />
      </div>
      <div className="member-card-small__name">Алексей Кульпин</div>
      <div className="member-card-small__role">Волонтер</div>
    </div>
  );
};

export default MemberCardSmallBage;
