import { ReactElement } from "react";
import { useStoreState } from "../../../model/helpers/hooks";
import TaskMetaItem from "./TaskMetaItem";
import iconApproved from "../../../assets/img/icon-all-done.svg";
import metaIconCalendar from "../../../assets/img/icon-calc.svg";
import metaIconShare from "../../../assets/img/icon-share.svg";
import { getTheDate, getTheIntervalToNow } from "../../../utilities/utilities";

/*
const TaskMeta: React.FunctionComponent = (): ReactElement => {
  const { dateGmt, doerCandidatesCount, viewsCount } = useStoreState(
    (state) => state.components.task
  );
*/
function TaskMeta(props) {
  const { dateGmt, doerCandidatesCount, viewsCount, isApproved } = props.task

  const withMetaIconCalendar: Array<string> = [
    getTheDate({ dateString: `${dateGmt}Z` }),
    `Открыто ${getTheIntervalToNow({ fromDateString: `${dateGmt}Z` })}`,
    `${doerCandidatesCount} откликов`,
    `${viewsCount} просмотров`,
  ];

  return (
    <div className="meta-info">
      {isApproved &&
        <img src={iconApproved} className="itv-approved" />
      }
      {withMetaIconCalendar.map((title, i) => {
        return (
          <TaskMetaItem key={i}>
            <img src={metaIconCalendar} />
            <span>{title}</span>
          </TaskMetaItem>
        );
      })}
      <TaskMetaItem>
        <img src={metaIconShare} />
        <a href="#" className="share-task">
          <span>Поделиться</span>
        </a>
      </TaskMetaItem>
    </div>
  );
};

export default TaskMeta;
