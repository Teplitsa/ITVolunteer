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
    user: { logoutUrl },
  } = useStoreState((state) => state.session);
  const {
    username: memberName,
    organizationName,
    thankyouCount,
    rating,
    reviewsCount,
    xp,
  } = useStoreState((state) => state.components.memberAccount);
  const giveThanksRequest = useStoreActions(
    (actions) => actions.components.memberAccount.giveThanksRequest
  );

  return (
    <>
      <div className="member-card">
        <MemberCardBage />
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
        {organizationName && <MemberCardOrganization />}
        <MemberCardBottom />
        <hr className="member-card__divider" />
        {isSessionLoaded && (
          <div className="member-card__action">
            {(isAccountOwner && (
              <>
                {/* <Link href="tasks">
                  <a className="btn btn_primary btn_full-width" target="_blank">
                    Хочу помогать другим
                  </a>
                </Link> */}
                <Link href={`/members/${memberName}/profile`}>
                  <a className="btn btn_link btn_full-width">
                    Редактировать профиль
                  </a>
                </Link>
              </>
            )) || (
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
                <span className="member-card__thank-count">
                  Сказали спасибо: {thankyouCount}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      {isAccountOwner && (
        <>
          <Link href={`/members/${memberName}/security`}>
            <a className="btn btn_default btn_full-width">
              Управление аккаунтом
            </a>
          </Link>
          <a className="btn btn_default btn_full-width" href={logoutUrl}>
            Выйти
          </a>
        </>
      )}
    </>
  );
};

export default MemberCard;
