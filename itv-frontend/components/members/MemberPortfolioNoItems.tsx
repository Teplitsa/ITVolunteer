import { ReactElement } from "react";
import { useStoreState } from "../../model/helpers/hooks";
import Link from "next/link";
import VolunteerPortfolioImage from "../../assets/img/illustration-volunteer-portfolio.svg";

const MemberPortfolioNoItems: React.FunctionComponent = (): ReactElement => {
  const { isAccountOwner } = useStoreState(store => store.session);
  const { username } = useStoreState(store => store.components.memberAccount);

  return (
    <div className="member-portfolio">
      <div className="member-portfolio__header">
        <div className="member-portfolio__title">Портфолио</div>
      </div>
      <div className="member-portfolio__no-items">
        <img src={VolunteerPortfolioImage} alt="" />
        <p>
          Здесь будет показано ваше Портфолио.
          <br />
          Лучшие работы, которые повысят уровень доверия заказчиков к вам
        </p>
      </div>
      <div className="member-portfolio__footer member-portfolio__footer_no-items">
        {isAccountOwner && <Link
          href="/members/[username]/add-portfolio-item"
          as={`/members/${username}/add-portfolio-item`}
        >
          <a className="btn btn_default">
            Добавить первую работу
          </a>
        </Link>}
      </div>
    </div>
  );
};

export default MemberPortfolioNoItems;
