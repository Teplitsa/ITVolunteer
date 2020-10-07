import { ReactElement } from "react";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import { ITaskCommentAuthor } from "../../../../model/model.typing";
import UserCardSmall from "../../../UserCardSmall";

const TaskTimelineWorkType: React.FunctionComponent<{
  status: string;
  doer: ITaskCommentAuthor;
}> = ({
  status,
  doer,
}): ReactElement => {
  const { isTaskAuthorLoggedIn } = useStoreState(
    (state) => state.session
  );
  const { id: taskId, doers } = useStoreState((state) => state.components.task);
  const {
    manageDoerRequest: manageDoer,
    updateDoers,
    taskRequest,
    timelineRequest,
  } = useStoreActions((actions) => actions.components.task);

  const declineFn = manageDoer.bind(null, {
    action: "decline-candidate",
    taskId,
    doer,
    callbackFn: () => {
      updateDoers(doers.filter(({ id }) => id !== doer.id));
      taskRequest();
      timelineRequest();
    },
  });

  return (
    <>
      <div className="details">
        <UserCardSmall {...doer} />
      </div>
      {isTaskAuthorLoggedIn && doer && status === "current" && (
      <div className="details actions">
        <a
          href="#"
          className="action close-task"
          onClick={(event) => {
            event.preventDefault();
            declineFn();
          }}
        >
          Открепить волонтера от задачи
        </a>
      </div>
      )}
    </>
  );
};

export default TaskTimelineWorkType;
