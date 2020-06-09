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
}): ReactElement => {
  const user = useStoreState((state) => state.session.user);
  const isTaskAuthorLoggedIn = useStoreState((state) => state.session.isTaskAuthorLoggedIn);
  const { approvedDoer } = useStoreState((state) => state.components.task);

  return (
    <div
      className={`checkpoint ${status} ${type} ${decision} ${
        isOverdue ? "overdue" : ""
      }`}
    >
      <TaskTimelineDate date={timeline_date} />
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

        {status === "future" && <div className="details">Ожидаемый срок</div>}

        {type === "review" && status === "closed" && <TaskTimelineReviewType />}
        {type == "close" && ((approvedDoer && approvedDoer?.id === user.id) || isTaskAuthorLoggedIn) && (
          <TaskTimelineCloseType />
        )}
        {type === "close_suggest" && approvedDoer && (
          <TaskTimelineCloseSuggestType {...{ id, status, message }} />
        )}
        {type === "close_decision" && approvedDoer && (
          <TaskTimelineCloseDecisionType />
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
