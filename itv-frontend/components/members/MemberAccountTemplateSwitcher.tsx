import { ReactElement, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const MemberAccountTemplateSwitcher: React.FunctionComponent = (): ReactElement => {
  const { isAccountOwner } = useStoreState(store => store.session);
  const memberAccount = useStoreState(store => store.components.memberAccount);
  const { setTemplate, getMemberReviewsRequest, changeItvRoleRequest, getMemberTasksRequest, getMemberTaskStatsRequest } = useStoreActions(
    actions => actions.components.memberAccount
  );

  useEffect(() => {
    if(!memberAccount.template) {
      return;
    }

    getMemberReviewsRequest({ customPage: 0, isReviewListReset: true });
    getMemberTasksRequest({ customPage: 0, isTaskListReset: true });
    getMemberTaskStatsRequest();
  }, [memberAccount.template]);

  return (
    <div className="member-account__template-switcher">
      {(memberAccount.template === "volunteer" || memberAccount.isHybrid) && (
        <button
          className={`member-account__template-switcher-btn ${
            (memberAccount.template === "volunteer" &&
              "member-account__template-switcher-btn_active") ||
            ""
          }`}
          type="button"
          onClick={event => {
            event.preventDefault();
            (isAccountOwner && changeItvRoleRequest({ itvRole: "doer" })) ||
              setTemplate({ template: "volunteer" });
          }}
        >
          Волонтер
        </button>
      )}
      {(memberAccount.template === "author" || memberAccount.isHybrid) && (
        <button
          className={`member-account__template-switcher-btn ${
            (memberAccount.template === "author" &&
              "member-account__template-switcher-btn_active") ||
            ""
          }`}
          type="button"
          onClick={event => {
            event.preventDefault();
            (isAccountOwner && changeItvRoleRequest({ itvRole: "author" })) ||
              setTemplate({ template: "author" });
          }}
        >
          Автор
        </button>
      )}
    </div>
  );
};

export default MemberAccountTemplateSwitcher;
