import { ReactElement } from "react";

const MemberAccountSkeleton: React.FunctionComponent = (): ReactElement => {
  return (
    <div className="member-account-skeleton">
      <div className="member-account-skeleton__cover" />
      <div className="member-account-skeleton__inner">
        <div className="member-account-skeleton__sidebar" />
        <div className="member-account-skeleton__content">
          <div className="member-account-skeleton__tabs-nav">
            <div className="member-account-skeleton__tabs-nav-item">Задачи</div>
            <div className="member-account-skeleton__tabs-nav-item">Отзывы</div>
          </div>
          <div className="member-account-skeleton__tasks-title">Задачи</div>
          <div className="member-account-skeleton__task-list">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`TaskListItem-${i}`}
                  className="member-account-skeleton__task-list-item"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberAccountSkeleton;
