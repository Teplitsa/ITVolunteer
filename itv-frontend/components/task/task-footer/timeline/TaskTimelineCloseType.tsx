import { ReactElement, useState } from "react";
import Router from "next/router";
import {
  useStoreState,
  useStoreActions,
} from "../../../../model/helpers/hooks";
import TaskTimelineDateSuggest from "./TaskTimelineDateSuggest";
import TaskTimelineSuggestComment from "./TaskTimelineSuggestComment";
import TaskTimelineOpenCloseSuggest from "./TaskTimelineOpenCloseSuggest";

const TaskTimelineCloseType: React.FunctionComponent = (): ReactElement => {
  const { databaseId: userId, fullName: userName } = useStoreState(
    (state) => state.session.user
  );
  const { isTaskAuthorLoggedIn, user } = useStoreState(
    (state) => state.session
  );
  const {
    databaseId,
    title,
    approvedDoer: { databaseId: partnerId, fullName: partnerName },
    author,
  } = useStoreState((state) => state.components.task);
  const isApprovedDoerLoggedIn = user.databaseId === partnerId;
  const setCompleteTaskWizardState = useStoreActions(
    (actions) => actions.components.completeTaskWizard.setInitState
  );
  const suggestCloseTaskRequest = useStoreActions(
    (actions) => actions.components.task.suggestCloseTaskRequest
  );
  const [isOpenDateSuggest, setOpenDateSuggest] = useState<boolean>(false);
  const [suggestedCloseDate, setSuggestedCloseDate] = useState<Date | null>(
    null
  );
  const [isOpenDateSuggestComment, setOpenDateSuggestComment] = useState<
    boolean
  >(false);
  const [isOpenCloseSuggest, setOpenCloseSuggest] = useState<boolean>(false);

  const completeTaskByAuthor = () => {
    suggestCloseTaskRequest({});
    setCompleteTaskWizardState({
      user: {
        databaseId: userId,
        name: userName,
        isAuthor: isTaskAuthorLoggedIn,
      },
      partner: { databaseId: partnerId, name: partnerName },
      task: { databaseId, title },
    });

    Router.push({
      pathname: "/task-complete",
    });
  };

  const completeTaskByDoer = () => {
    suggestCloseTaskRequest({});
    setCompleteTaskWizardState({
      user: {
        databaseId: user.databaseId,
        name: user.fullName,
        isAuthor: false,
      },
      partner: { databaseId: author.databaseId, name: author.fullName },
      task: { databaseId, title },
    });

    Router.push({
      pathname: "/task-complete",
    });
  };

  return (
    <div className="details actions">
      {!isTaskAuthorLoggedIn && (
        <a
          href="#"
          className={`action suggest-date ${
            ((isOpenDateSuggest || isOpenDateSuggestComment) && "active") || ""
          }`}
          onClick={(event) => {
            event.preventDefault();
            if (isOpenDateSuggestComment) {
              setOpenDateSuggestComment(false);
            } else if (isOpenDateSuggest) {
              setOpenDateSuggest(false);
            } else {
              setOpenCloseSuggest(false);
              setOpenDateSuggest(true);
            }
          }}
        >
          Предложить новую дату
        </a>
      )}

      {isTaskAuthorLoggedIn && (
        <a
          href="#"
          className="action close-task"
          onClick={(event) => {
            event.preventDefault();
            completeTaskByAuthor();
          }}
        >
          Закрыть задачу
        </a>
      )}

      {isApprovedDoerLoggedIn && (
        <a
          href="#"
          className="action close-task"
          onClick={(event) => {
            event.preventDefault();
            completeTaskByDoer();
          }}
        >
          Закрыть задачу
        </a>
      )}

      {isOpenDateSuggest && (
        <TaskTimelineDateSuggest
          {...{
            setOpenDateSuggest,
            setOpenDateSuggestComment,
            setSuggestedCloseDate,
          }}
        />
      )}

      {isOpenDateSuggestComment && (
        <TaskTimelineSuggestComment
          {...{
            setOpenDateSuggestComment,
            setOpenDateSuggest,
            suggestedCloseDate,
          }}
        />
      )}

      {isOpenCloseSuggest && (
        <TaskTimelineOpenCloseSuggest {...{ setOpenCloseSuggest }} />
      )}
    </div>
  );
};

export default TaskTimelineCloseType;
