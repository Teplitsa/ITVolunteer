import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import MemberNotificationItem from "./MemberNotificationItem";

const MemberNotifications: React.FunctionComponent = (): ReactElement => {
  const isAccountOwner = useStoreState(state => state.session.isAccountOwner);

  if (!isAccountOwner) return null;

  const {
    notificationStats,
    notifications: { filter: notificationListFilter, list: notifications },
  } = useStoreState(state => state.components.memberAccount);
  const {
    setNotificationListFilter,
    setNotificationsPage,
    getMemberNotificationsRequest,
  } = useStoreActions(actions => actions.components.memberAccount);

  const changeFilterHandle = (filter: "all" | "project" | "info"): void => {
    setNotificationListFilter(filter);
    setNotificationsPage(1);
    getMemberNotificationsRequest({ isListReset: true });
  };

  return (
    <div className="member-notifications">
      <div className="member-notifications__header">
        <div className="member-notifications__title">Оповещения</div>
        <div className="member-tasks__filter">
          <ul>
            {([
              ["all", "Все"],
              ["project", "По проектам"],
              ["info", "Информационные"],
            ] as Array<["all" | "project" | "info", string]>).map(
              ([filterLabel, filterTitle], i) => (
                <li key={`NotificationFilter-${i}`}>
                  <a
                    className={`member-tasks__filter-control ${
                      notificationListFilter === filterLabel
                        ? "member-tasks__filter-control_active"
                        : ""
                    }`}
                    href="#"
                    onClick={event => {
                      event.preventDefault();
                      changeFilterHandle(filterLabel);
                    }}
                  >
                    {filterTitle} (
                    {filterLabel === "all"
                      ? Object.values(notificationStats).reduce((sum, value) => sum + value, 0)
                      : notificationStats[filterLabel]}
                    )
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <div className="member-notifications__list">
        {notifications.map((notification, i) => {
          return <MemberNotificationItem key={i} {...notification} />;
        })}
      </div>
      <div className="member-notifications__footer">
        <a
          href="#"
          className="member-notifications__more-link"
          onClick={event => {
            event.preventDefault();
            getMemberNotificationsRequest({ isListReset: false });
          }}
        >
          Показать ещё
        </a>
      </div>
    </div>
  );
};

export default MemberNotifications;
