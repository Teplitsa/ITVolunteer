import { ReactElement } from "react";

const HomeSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="home-skeleton">
      <div className="home-skeleton__banner" />
      <div className="home-skeleton__inner">
        <div className="home-skeleton__stats">
          <div className="home-skeleton__stats-inner">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`StatsItem-${i}`}
                  className="home-skeleton__stats-item"
                />
              ))}
          </div>
        </div>
        <div className="home-skeleton__task-list-title" />
        <div className="home-skeleton__task-list">
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <div
                key={`TaskListItem-${i}`}
                className="home-skeleton__task-list-item"
              />
            ))}
        </div>
        <div className="home-skeleton__task-list-more" />
        <div className="home-skeleton__news-list-title" />
        <div className="home-skeleton__news-list">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <div
                key={`NewsListItem-${i}`}
                className="home-skeleton__news-list-item"
              >
                <div className="home-skeleton__news-list-item-image" />
                <div className="home-skeleton__news-list-item-title" />
                <div className="home-skeleton__news-list-item-date" />
                <div className="home-skeleton__news-list-item-content" />
              </div>
            ))}
        </div>
        <div className="home-skeleton__news-list-more" />
      </div>
    </div>
  );
};

export default HomeSkeleton;
