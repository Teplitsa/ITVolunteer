import { ReactElement } from "react";

const PortfolioItem: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="portfolio-item-skeleton">
      <div className="portfolio-item-skeleton__inner">
        <div className="portfolio-item-skeleton__user-card">
          <div className="portfolio-item-skeleton__column-mock" />
        </div>
        <div className="portfolio-item-skeleton__content">
          <div className="portfolio-item-skeleton__column-mock" />
        </div>
        <div className="portfolio-item-skeleton__media">
          <div className="portfolio-item-skeleton__column-mock portfolio-item-skeleton__column-mock_wide" />
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
