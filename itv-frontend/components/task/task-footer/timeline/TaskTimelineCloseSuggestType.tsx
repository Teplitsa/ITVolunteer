import { ReactElement } from "react";
import Router from "next/router";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import UserCardSmall from "../../../UserCardSmall";

const TaskTimelineCloseSuggestType: React.FunctionComponent<{
  id: number;
  status: string;
  message: string;
}> = ({ id, status, message }): ReactElement => {
  const { databaseId: userId, fullName: userName } = useStoreState(
    (state) => state.session.user
  );
  const {
    databaseId: taskId,
    title,
    approvedDoer: { databaseId: partnerId, fullName: partnerName },
    author,
  } = useStoreState((state) => state.components.task);
  const isTaskAuthorLoggedIn = useStoreState(
    (state) => state.session.isTaskAuthorLoggedIn
  );
  const approvedDoer = useStoreState(
    (state) => state.components.task?.approvedDoer
  );
  const {
    acceptSuggestedCloseRequest,
    rejectSuggestedCloseRequest,
  } = useStoreActions((state) => state.components.task);
  const setCompleteTaskWizardState = useStoreActions(
    (actions) => actions.components.completeTaskWizard.setInitState
  );
  const acceptSuggestedClose = acceptSuggestedCloseRequest.bind(null, {
    timelineItemId: id,
  });
  const rejectSuggestedClose = rejectSuggestedCloseRequest.bind(null, {
    timelineItemId: id,
  });

  return (
    <div className="details">
      <UserCardSmall {...approvedDoer} />
      <div className="comment">{message}</div>

      {isTaskAuthorLoggedIn && status !== "past" && (
        <div className="decision-action">
          <a
            href="#"
            className="accept"
            onClick={(event) => {
              event.preventDefault();
              acceptSuggestedClose();

              // open wizard
              setCompleteTaskWizardState({
                user: {
                  databaseId: userId,
                  name: userName,
                  isAuthor: isTaskAuthorLoggedIn,
                },
                partner: { databaseId: partnerId, name: partnerName },
                task: { databaseId: taskId, title },
              });

              Router.push({
                pathname: "/task-complete",
              });              
            }}
          >
            Принять
          </a>
          <a
            href="#"
            className="reject danger"
            onClick={(event) => {
              event.preventDefault();
              rejectSuggestedClose();
            }}
          >
            Отклонить
          </a>
        </div>
      )}
    </div>
  );
};

export default TaskTimelineCloseSuggestType;
