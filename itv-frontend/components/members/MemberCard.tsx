import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberCardBage from "components/members/MemberCardBage";
import MemberStats from "components/MemberStats";
import MemberCardOrganization from "components/members/MemberCardOrganization";
import MemberCardBottom from "components/members/MemberCardBottom";

const MemberCard: React.FunctionComponent = (): ReactElement => {
  const {
    isLoggedIn,
    isAccountOwner,
    isLoaded: isSessionLoaded,
    user: { itvRole },
  } = useStoreState(state => state.session);
  const {
    slug: memberSlug,
    organizationName,
    thankyouCount,
    rating,
    reviewsCount,
    xp,
    isEmptyProfile,
    profileFillStatus,
  } = useStoreState(state => state.components.memberAccount);
  const giveThanksRequest = useStoreActions(
    actions => actions.components.memberAccount.giveThanksRequest
  );

  return (
    <>
      <div className="member-card">
        <MemberCardBage />
        {!isEmptyProfile && (
          <MemberStats
            {...{
              useComponents: ["rating", "reviewsCount", "xp"],
              rating,
              reviewsCount,
              xp,
              withBottomdivider: true,
              align: "center",
            }}
          />
        )}
        {organizationName && <MemberCardOrganization />}
        {isAccountOwner && profileFillStatus && !profileFillStatus.isProfileInfoEnough && (
          <div className="member-card__null-add-information">
            <Link href={`/members/${memberSlug}/profile`}>
              <a>Добавьте информацию о себе</a>
            </Link>
          </div>
        )}
        {isEmptyProfile && <hr className="member-card__divider" />}
        <MemberCardBottom />
        {(!isEmptyProfile || isAccountOwner) && <hr className="member-card__divider" />}
        {isSessionLoaded && (
          <div className="member-card__action">
            {(isAccountOwner && (
              <>
                {(itvRole === "doer" && (
                  <Link href="/tasks">
                    <a className="btn btn_primary btn_full-width cta">Найти задачу</a>
                  </Link>
                )) || (
                  <Link href="/task-actions">
                    <a className="btn btn_primary btn_full-width cta">Создать задачу</a>
                  </Link>
                )}
                <Link href={`/members/${memberSlug}/profile`}>
                  <a className="btn btn_full-width edit-profile">Редактировать профиль</a>
                </Link>
              </>
            )) ||
              (!isEmptyProfile && (
                <>
                  {isLoggedIn && (
                    <button
                      className="btn btn_primary btn_full-width"
                      type="button"
                      onClick={() => giveThanksRequest()}
                    >
                      Сказать «Спасибо»
                    </button>
                  )}
                  <span className="member-card__thank-count">Сказали спасибо: {thankyouCount}</span>
                </>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MemberCard;
