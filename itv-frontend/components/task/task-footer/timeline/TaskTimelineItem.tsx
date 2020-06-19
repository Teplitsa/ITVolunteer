import { ReactElement } from "react";
import { useStoreState } from "../../../../model/helpers/hooks";
import { ITaskTimelineItem } from "../../../../model/model.typing";
import TaskTimelineDate from "./TaskTimelineDate";
import TaskTimelineReviewType from "./TaskTimelineReviewType";
import TaskTimelineDateDecisionType from "./TaskTimelineDateDecisionType";
import TaskTimelineWorkType from "./TaskTimelineWorkType";
import TaskTimelinePublicationType from "./TaskTimelinePublicationType";
import TaskTimelineSearchDoerType from "./TaskTimelineSearchDoerType";
import TaskTimelineCloseDecisionType from "./TaskTimelineCloseDecisionType";
import TaskTimelineDateSuggestType from "./TaskTimelineDateSuggestType";
import TaskTimelineCloseSuggestType from "./TaskTimelineCloseSuggestType";
import TaskTimelineCloseType from "./TaskTimelineCloseType";

const TaskTimelineItem: React.FunctionComponent<ITaskTimelineItem> = ({
  id,
  status,
  type,
  title,
  decision,
  message,
  isOverdue,
  timeline_date,
  doer,
  taskHasCloseSuggestion,
}): ReactElement => {
  const user = useStoreState((state) => state.session.user);
  const isTaskAuthorLoggedIn = useStoreState((state) => state.session.isTaskAuthorLoggedIn);
  const { approvedDoer, status: taskStatus } = useStoreState((state) => state.components.task);  

  return (type==="close" && taskHasCloseSuggestion) ? null : (
    <div
      className={`checkpoint ${status} ${type} ${decision} ${
        isOverdue ? "overdue-DISABLED" : ""
      }`}
    >
      {/* temporary disable dates
      <TaskTimelineDate date={timeline_date} />
      */}
      <div className="info">
        <i className="point-circle"></i>
        <h4>
          {title}
          {type === "date_suggest" &&
            " " +
              new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(Date.parse(timeline_date))}
        </h4>

        {/* temporary disable dates
        {status === "future" && <div className="details">Ожидаемый срок</div>}
        */}

        {type === "review" && taskStatus === "closed" && <TaskTimelineReviewType />}
        {type === "close" && taskStatus === "in_work" && ((approvedDoer && approvedDoer?.id === user.id) || isTaskAuthorLoggedIn) && !taskHasCloseSuggestion && (
          <TaskTimelineCloseType />
        )}
        {type === "close" && taskStatus === "closed" && !!message && (
          <TaskTimelineCloseDecisionType {...{ id, status, message }} />
        )}
        {type === "close_suggest" && approvedDoer && (
          <TaskTimelineCloseSuggestType {...{ id, status, message }} />
        )}
        {type === "close_decision" && approvedDoer && (
          <TaskTimelineCloseDecisionType {...{ id, status, message }} />
        )}
        {type === "date_suggest" && approvedDoer && (
          <TaskTimelineDateSuggestType {...{ id, status, message }} />
        )}
        {type === "date_decision" && approvedDoer && (
          <TaskTimelineDateDecisionType />
        )}
        {type === "work" && approvedDoer && doer && (
          <TaskTimelineWorkType {...doer} />
        )}
        {type === "publication" && <TaskTimelinePublicationType />}
        {type === "search_doer" && <TaskTimelineSearchDoerType />}
      </div>
    </div>
  );
};

export default TaskTimelineItem;
