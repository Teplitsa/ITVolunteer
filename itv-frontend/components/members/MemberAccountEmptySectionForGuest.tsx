import { ReactElement } from "react";
import ManImage from "../../assets/img/illustration-empty-section-man.svg";

const MemberAccountEmptySectionForGuest: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="member-account-null__empty-section">
      <div className="empty-section__content">
        <img className="empty-section__content-image" src={ManImage} alt="" />
        <div className="empty-section__content-text">
          К сожалению, пользователь пока не совершил действий на платформе.
          <br />
          Мы очень надеемся, что скоро это изменится.
        </div>
      </div>
    </div>
  );
};

export default MemberAccountEmptySectionForGuest;
