import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberCardBage from "components/members/MemberCardBage";
import MemberStats from "components/MemberStats";
import MemberCardOrganization from "components/members/MemberCardOrganization";
import MemberCardBottom from "components/members/MemberCardBottom";

const MemberCard: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isAccountOwner } = useStoreState(state => state.session);
  const {
    slug: memberSlug,
    organizationName,
    thankyouCount,
    rating,
    reviewsCount,
    xp,
    isEmptyProfile,
    profileFillStatus,
    template: memberAccountTemplate,
    isEmptyProfileAsDoer,
    isEmptyProfileAsAuthor,
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
        {isAccountOwner && profileFillStatus?.isProfileInfoEnough === false && (
          <div className="member-card__null-add-information">
            <Link href={`/members/${memberSlug}/profile`}>
              <a>Рассказать о себе</a>
            </Link>
          </div>
        )}
        {isLoggedIn && <MemberCardBottom />}
        {(isAccountOwner ||
          (((memberAccountTemplate === "volunteer" && !isEmptyProfileAsDoer) ||
            (memberAccountTemplate === "customer" && !isEmptyProfileAsAuthor)) &&
            (isLoggedIn || thankyouCount > 0))) && (
          <div className="member-card__action">
            {(isAccountOwner && (
              <>
                {memberAccountTemplate === "volunteer" && (
                  <Link href="/tasks">
                    <a className="btn btn_primary btn_full-width cta">Найти задачу</a>
                  </Link>
                )}
                {memberAccountTemplate === "customer" && (
                  <Link href="/task-create">
                    <a className="btn btn_primary btn_full-width cta">Создать задачу</a>
                  </Link>
                )}
                <Link href={`/members/${memberSlug}/profile`}>
                  <a className="btn btn_full-width edit-profile">Редактировать профиль</a>
                </Link>
              </>
            )) ||
              (((memberAccountTemplate === "volunteer" && !isEmptyProfileAsDoer) ||
                (memberAccountTemplate === "customer" && !isEmptyProfileAsAuthor)) && (
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
                  {thankyouCount > 0 && (
                    <span className="member-card__thank-count">
                      Сказали спасибо: {thankyouCount}
                    </span>
                  )}
                </>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MemberCard;
