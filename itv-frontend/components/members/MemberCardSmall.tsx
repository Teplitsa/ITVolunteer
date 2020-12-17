import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import MemberCardSmallBage from "components/members/MemberCardSmallBage";
import MemberStats from "components/MemberStats";

const MemberCardSmall: React.FunctionComponent = (): ReactElement => {
  const { slug, rating, reviewsCount, xp } = useStoreState(
    state => state.components.portfolioItem.author
  );

  return (
    <>
      <div className="member-card-small">
        <MemberCardSmallBage />
        {true && (
          <MemberStats
            {...{
              useComponents: ["rating", "reviewsCount", "xp"],
              memberSlug: slug,
              rating,
              reviewsCount,
              xp,
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
