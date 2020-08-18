import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberCardBage from "components/members/MemberCardBage";
import MemberCardStats from "components/members/MemberCardStats";
import MemberCardOrganization from "components/members/MemberCardOrganization";
import MemberCardBottom from "components/members/MemberCardBottom";

const MemberCard: React.FunctionComponent = (): ReactElement => {
  return (
    <>
      <div className="member-card">
        <MemberCardBage />
        <MemberCardStats />
        <MemberCardOrganization />
        <MemberCardBottom />
        <hr className="member-card__divider" />
        <div className="member-card__action">
          <button className="btn btn_primary btn_full-width" type="button">
            Хочу помогать другим
          </button>
          <button className="btn btn_link btn_full-width" type="button">
            Редактировать профиль
          </button>
        </div>
      </div>
      <button className="btn btn_default btn_full-width" type="button">
        Управление аккаунтом
      </button>
      <button className="btn btn_default btn_full-width" type="button">
        Выйти
      </button>
    </>
  );
};

export default MemberCard;
