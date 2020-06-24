import { ReactElement } from "react";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import UserCardSmall from "../../../UserCardSmall";

const TaskTimelineCloseDecisionType: React.FunctionComponent<{
  id: number;
  status: string;
  message: string;
}> = ({ id, status, message }): ReactElement => {
  const isTaskAuthorLoggedIn = useStoreState(
    (state) => state.session.isTaskAuthorLoggedIn
  );
  const approvedDoer = useStoreState(
    (state) => state.components.task?.approvedDoer
  );
  const {
    acceptSuggestedDateRequest,
    rejectSuggestedDateRequest,
  } = useStoreActions((state) => state.components.task);
  const acceptSuggestedDate = acceptSuggestedDateRequest.bind(null, {
    timelineItemId: id,
  });
  const rejectSuggestedDate = rejectSuggestedDateRequest.bind(null, {
    timelineItemId: id,
  });

  return (
    <div className="details">
      <UserCardSmall {...approvedDoer} />
      <div className="comment">{message}</div>

      {isTaskAuthorLoggedIn && status === "current" && (
        <div className="decision-action">
          <a
            href="#"
            className="accept"
            onClick={(event) => {
              event.preventDefault();
              acceptSuggestedDate();
            }}
          >
            Принять
          </a>
          <a
            href="#"
            className="reject danger"
            onClick={(event) => {
              event.preventDefault();
              rejectSuggestedDate();
            }}
          >
            Отклонить
          </a>
        </div>
      )}
    </div>
  );
};

export default TaskTimelineCloseDecisionType;
