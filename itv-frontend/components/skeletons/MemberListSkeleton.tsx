import { ReactElement } from "react";
import { USER_PER_PAGE } from "../../model/components/members-model";

export const MemberListSkeletonItemsOnly: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="member-list-skeleton__items">
      {Array(USER_PER_PAGE)
        .fill(null)
        .map((_, i) => (
          <div key={`Item-${i}`} className="member-list-skeleton__item-mock" />
        ))}
    </div>
  );
};

const MemberListSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="member-list-skeleton">
      <div className="member-list-skeleton__inner">
        <div className="member-list-skeleton__top">
          <h1 className="member-list-skeleton__title">Рейтинг</h1>
        </div>
        <div className="member-list-skeleton__filter">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={`FilterItem-${i}`} className="member-list-skeleton__filter-item-mock" />
            ))}
        </div>
        <div className="member-list-skeleton__live-search">
          <div className="member-list-skeleton__live-search-mock" />
        </div>
        <MemberListSkeletonItemsOnly />
        <div className="member-list-skeleton__more">
          <div className="member-list-skeleton__more-mock" />
        </div>
      </div>
    </div>
  );
};

export default MemberListSkeleton;
