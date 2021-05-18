import { ReactElement, useState, MouseEvent } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { IMemberListItem } from "../../model/model.typing";
import MemberStats from "../MemberStats";
import MemberAvatar from "../MemberAvatar";
import { convertObjectToClassName } from "../../utilities/utilities";

const MemberListItem: React.FunctionComponent<{
  index: number;
  member: IMemberListItem;
}> = ({ index, member }): ReactElement => {
  const [isThanksGiven, setIsThanksGiven] = useState<boolean>(false);
  const isLoggedIn = useStoreState(state => state.session.isLoggedIn);
  const giveThanksRequest = useStoreActions(
    actions => actions.components.members.giveThanksRequest
  );

  const handleGiveThanks = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    !isThanksGiven && giveThanksRequest({ toUserId: member.id, setIsThanksGiven });
  };

  return (
    <div
      className={convertObjectToClassName({
        volunteer: true,
        volunteer_first: member.ratingSolvedTasksPosition === 1,
        volunteer_second: member.ratingSolvedTasksPosition === 2,
        volunteer_third: member.ratingSolvedTasksPosition === 3,
      })}
    >
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
          <div className="volunteer__stats">
            <MemberStats
              {...{
                memberSlug: member.slug,
                useComponents: ["rating", "reviewsCount", "xp"],
                rating: member.rating,
                reviewsCount: member.reviewsCount,
                xp: member.xp,
                noMargin: true,
                align: "left",
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={convertObjectToClassName({
          volunteer__index: true,
          volunteer__index_first: member.ratingSolvedTasksPosition === 1,
          volunteer__index_second: member.ratingSolvedTasksPosition === 2,
          volunteer__index_third: member.ratingSolvedTasksPosition === 3,
        })}
      >
        {member.ratingSolvedTasksPosition}
      </div>
      {isLoggedIn && (
        <div className="volunteer__give-thanks">
          <button
            className="volunteer__give-thanks-btn"
            type="button"
            onClick={handleGiveThanks}
          >
            {isThanksGiven ? "Вы сказали «Спасибо»" : "Сказать «Спасибо»"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberListItem;
