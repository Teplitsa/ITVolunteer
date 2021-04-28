import { ReactElement } from "react";
import Link from "next/link";
import { IMemberListItem } from "../../model/model.typing";
import MemberStats from "../MemberStats";
import MemberAvatar from "../MemberAvatar";

const MemberListItemTop: React.FunctionComponent<{
  index: number;
  member: IMemberListItem;
}> = ({ index, member }): ReactElement => {
  return (
    <div className="volunteer volunteer_top">
      <div className="volunteer__header">
        <div className="volunteer__avatar">
          <MemberAvatar
            {...{
              memberAvatar: member.itvAvatar,
              memberFullName: member.fullName,
              size: "medium",
            }}
          />
        </div>
        <div className="volunteer__bage">
          <div className="volunteer__full-name">
            <Link href={`/members/${member.slug}`}>
              <a
                className="volunteer__account-link"
                target="_blank"
                dangerouslySetInnerHTML={{ __html: member.fullName }}
              />
            </Link>
          </div>
          <div className="volunteer__role">
            <div className="volunteer__role-bage">{member.memberRole}</div>
          </div>
          <div
            className="volunteer__organization-name"
            dangerouslySetInnerHTML={{ __html: member.organizationName }}
          />
        </div>
      </div>
      <div className="volunteer__divider" />
      <div className="volunteer__stats">
      <div />
        <MemberStats
          {...{
            rating: member.rating,
            memberSlug: member.slug,
            reviewsCount: member.reviewsCount,
            xp: member.xp,
            solvedProblems: member.solvedProblems,
            noMargin: true,
            align: "left",
          }}
        />
      </div>
      <div className="volunteer__index">{index}</div>
    </div>
  );
};

export default MemberListItemTop;
