import { ReactElement } from "react";
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
