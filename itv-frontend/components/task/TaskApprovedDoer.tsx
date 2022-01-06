import { ReactElement } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import * as utils from "../../utilities/utilities";
import MemberAvatar from "../MemberAvatar";
import TaskDoerStats from "./TaskDoerStats";

const TaskApprovedDoer: React.FunctionComponent = (): ReactElement => {
  const { isTaskAuthorLoggedIn } = useStoreState(state => state.session);
  const { approvedDoer, status: taskStatus, id: taskId, doers } = useStoreState(
    state => state.components.task
  );

  const {
    manageDoerRequest: manageDoer,
    declineApprovedDoer,
    updateDoers,
    taskRequest,
    timelineRequest,
  } = useStoreActions(actions => actions.components.task);

  if (!approvedDoer) return null;

  const {
    fullName,
    profileURL: toProfile,
    itvAvatar: avatarImage,
    solvedTasksCount,
    doerReviewsCount,
    isPasekaMember,
    partnerIcon,
  } = approvedDoer;

  const declineFn = manageDoer.bind(null, {
    action: "decline-candidate",
    taskId,
    doer: approvedDoer,
    callbackFn: () => {
      updateDoers(doers.filter(({ id }) => id !== approvedDoer.id));
      declineApprovedDoer();
      taskRequest();
      timelineRequest();
    },
  });

  return (
    <>
      <h2>{taskStatus === "closed" ? "Помогли успешно решить задачу" : "Над задачей работает"}</h2>
      <div className="sidebar-users-block responses approved-doer">
        <div className="user-cards-list">
          <div className="user-card">
            <div className="user-card-inner">

              <div className={`avatar-wrapper-box-only`} >
                <MemberAvatar {...{ memberAvatar: avatarImage, memberFullName: fullName, size: "medium", isPasekaMember, partnerIcon }} />
              </div>

              <div className="details">
                <a className="name" href={toProfile}>
                  {fullName}
                </a>
                <TaskDoerStats {...{doer: approvedDoer, isApproved: true}} />
              </div>
            </div>

            {isTaskAuthorLoggedIn && taskStatus === "in_work" && (
              <div className="author-actions-on-doer i-am-author">
                <a
                  href="#"
                  className="reject-doer"
                  onClick={event => {
                    event.preventDefault();
                    declineFn();
                  }}
                >
                  Открепить от задачи
                </a>

                <div className="tooltip">
                  <div className="tooltip-buble">
                    <h4>Что такое &quot;Открепить от задачи&quot;?</h4>
                    <p>
                      Волонтёр открепляется (получает уведомление), задача переводится в статус
                      Опубликовано, <br />в календаре появляется новый этап – Поиск волонтёра.
                    </p>
                  </div>
                  <div className="tooltip-actor">?</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskApprovedDoer;
