import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState } from "../../model/helpers/hooks";
import MemberCardBage from "components/members/MemberCardBage";
import MemberCardStats from "components/members/MemberCardStats";
import MemberCardOrganization from "components/members/MemberCardOrganization";
import MemberCardBottom from "components/members/MemberCardBottom";

const MemberCard: React.FunctionComponent = (): ReactElement => {
  const {
    isAccountOwner,
    isLoaded: isSessionLoaded,
    user: { logoutUrl },
  } = useStoreState((state) => state.session);
  const { name: memberName, organizationName } = useStoreState(
    (state) => state.components.memberAccount
  );
  const thankCount = 123;

  return (
    <>
      <div className="member-card">
        <MemberCardBage />
        <MemberCardStats />
        {organizationName && <MemberCardOrganization />}
        <MemberCardBottom />
        <hr className="member-card__divider" />
        {isSessionLoaded && (
          <div className="member-card__action">
            {(isAccountOwner && (
              <>
                <Link href="tasks">
                  <a className="btn btn_primary btn_full-width" target="_blank">
                    Хочу помогать другим
                  </a>
                </Link>
                <Link href={`/members/${memberName}/profile`}>
                  <a className="btn btn_link btn_full-width">
                    Редактировать профиль
                  </a>
                </Link>
              </>
            )) || (
              <>
                <button
                  className="btn btn_primary btn_full-width"
                  type="button"
                >
                  Сказать «Спасибо»
                </button>
                <span className="member-card__thank-count">
                  Сказали спасибо: {123}
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
