import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Link from "next/link";
import MemberPortfolioItem from "./MemberPortfolioItem";

const MemberPortfolio: React.FunctionComponent = (): ReactElement => {
  const {
    username,
    portfolio: { list: portfolioList },
  } = useStoreState(store => store.components.memberAccount);
  const { getMemberPortfolioRequest } = useStoreActions(actions => actions.components.memberAccount);

  return (
    <div className="member-portfolio">
      <div className="member-portfolio__header">
        <div className="member-portfolio__title">Портфолио</div>
        <div className="member-portfolio__actions">
          <Link
            href="/members/[username]/add-portfolio-item"
            as={`/members/${username}/add-portfolio-item`}
          >
            <a className="btn btn_hint-alt" target="_blank">
              + Добавить работу
            </a>
          </Link>
        </div>
      </div>
      <div className="member-portfolio__list">
        {portfolioList.map(({ id, slug, title, preview }) => (
          <MemberPortfolioItem key={id} {...{ username, slug, title, preview }} />
        ))}
      </div>
      <div className="member-portfolio__footer">
        <a
          href="#"
          className="member-portfolio__more-link"
          onClick={event => {
            event.preventDefault();
            getMemberPortfolioRequest();
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberPortfolio;
