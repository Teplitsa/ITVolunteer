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
  const isTaskAuthorLoggedIn = useStoreState(
    (state) => state.session.isTaskAuthorLoggedIn
  );
  const {
    databaseId,
    title,
    approvedDoer: { databaseId: partnerId, fullName: partnerName },
  } = useStoreState((state) => state.components.task);
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

  const completeTask = () => {
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
            completeTask();
          }}
        >
          Закрыть задачу
        </a>
      )}

      {/* <a
        href="#"
        className={`action close-task ${
          (isOpenCloseSuggest && "active") || ""
        }`}
        onClick={(event) => {
          event.preventDefault();
          if (isOpenCloseSuggest) {
            setOpenCloseSuggest(false);
          } else {
            setOpenDateSuggest(false);
            setOpenDateSuggestComment(false);
            setOpenCloseSuggest(true);
          }
        }}
      >
        Закрыть задачу
      </a> */}

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
