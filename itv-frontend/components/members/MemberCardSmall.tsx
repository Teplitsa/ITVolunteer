import { ReactElement } from "react";
// import Link from "next/link";
// import { useStoreState } from "../../model/helpers/hooks";
import MemberCardSmallBage from "components/members/MemberCardSmallBage";
import MemberStats from "components/MemberStats";

const MemberCardSmall: React.FunctionComponent = (): ReactElement => {
  //   const {
  //     isLoggedIn,
  //     isAccountOwner,
  //     isLoaded: isSessionLoaded,
  //     user: { logoutUrl },
  //   } = useStoreState((state) => state.session);
  //   const {
  //     username: memberName,
  //     rating,
  //     reviewsCount,
  //     xp,
  //     isEmptyProfile = false,
  //   } = useStoreState((state) => state.components.memberAccount);

  return (
    <>
      <div className="member-card-small">
        <MemberCardSmallBage />
        {true && (
          <MemberStats
            {...{
              useComponents: ["rating", "reviewsCount", "xp"],
              rating: 4.5,
              reviewsCount: 212,
              xp: 12000,
              withBottomdivider: false,
              align: "left",
            }}
          />
        )}
      </div>
    </>
  );
};

export default MemberCardSmall;
