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

import * as utils from "../../../../utilities/utilities";

const TaskTimelineItem: React.FunctionComponent<ITaskTimelineItem> = ({
  id,
  status,
  type,
  title,
  decision,
  message,
  isOverdue,
  timeline_date,
  doer_id,
  doer,
  taskHasCloseSuggestion,
}): ReactElement => {
  const user = useStoreState((state) => state.session.user);
  const isTaskAuthorLoggedIn = useStoreState((state) => state.session.isTaskAuthorLoggedIn);
  const { approvedDoer, status: taskStatus } = useStoreState((state) => state.components.task);  

  const reviewForDoer = useStoreState(
    (state) => state.components.task?.reviews?.reviewForDoer
  );

  const reviewForAuthor = useStoreState(
    (state) => state.components.task?.reviews?.reviewForAuthor
  );

  return (type==="close" && taskHasCloseSuggestion) ? null : (
    <div
      className={`checkpoint ${status} ${type} ${decision} 
        ${isOverdue ? "overdue-DISABLED" : ""}
        ${reviewForDoer && reviewForAuthor && taskStatus === "closed" ? "completed" : ""}
      `}
    >
      {type !== "close" && (status === "current" || status === "past") &&
        <TaskTimelineDate date={timeline_date} />
      }

      {type === "close" &&
        <TaskTimelineDate date={timeline_date} />
      }

      {type !== "close" && status !== "current" && status !== "past" &&
        <div className="date"></div>
      }

      <div className="info">
        <i className="point-circle"></i>
        <h4>
          {title}
          {type === "date_suggest" && !!timeline_date &&
            " " +
              new Intl.DateTimeFormat("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(utils.itvWpDateTimeToDate(timeline_date))}
        </h4>

        {status === "future" && type === "close" && <div className="details">Ожидаемый срок</div>}

        {type === "review" && taskStatus === "closed" && <TaskTimelineReviewType />}
        {type === "close" && taskStatus === "in_work" && ((approvedDoer && approvedDoer?.id === user.id) || isTaskAuthorLoggedIn) && !taskHasCloseSuggestion && (
          <TaskTimelineCloseType />
        )}
        {type === "close" && taskStatus === "closed" && !!message && (
          <TaskTimelineCloseDecisionType {...{ id, status, message }} />
        )}
        {type === "close_suggest" && (
          <TaskTimelineCloseSuggestType {...{ id, status, message, doer, doerId: Number(doer_id) }} />
        )}
        {type === "close_decision" && (
          <TaskTimelineCloseDecisionType {...{ id, status, message }} />
        )}
        {type === "date_suggest" && (
          <TaskTimelineDateSuggestType {...{ id, status, message, doer }} />
        )}
        {type === "date_decision" && (
          <TaskTimelineDateDecisionType />
        )}
        {type === "work" && doer && (
          <TaskTimelineWorkType {...{ status, doer }} />
        )}
        {type === "publication" && <TaskTimelinePublicationType />}
        {type === "search_doer" && <TaskTimelineSearchDoerType />}
      </div>
    </div>
  );
};

export default TaskTimelineItem;
