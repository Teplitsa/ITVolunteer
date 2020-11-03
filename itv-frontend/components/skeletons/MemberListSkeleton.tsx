import { ReactElement } from "react";

const MemberListSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="member-list-skeleton">
      <div className="member-list-skeleton__inner">
        <div className="member-list-skeleton__top">
          <h1 className="member-list-skeleton__title">Волонтеры</h1>
        </div>
        <div className="member-list-skeleton__items">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <div
                key={`Item-${i}`}
                className="member-list-skeleton__item-mock"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MemberListSkeleton;
