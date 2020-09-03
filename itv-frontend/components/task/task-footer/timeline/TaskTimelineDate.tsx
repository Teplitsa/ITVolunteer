import { ReactElement, createElement } from "react";
import * as utils from "../../../../utilities/utilities";

const TaskTimelineDate: React.FunctionComponent<{
  date: string,
}> = ({ date }): ReactElement => {
  return (
    <div className="date">
      {createElement(
        ({ dateFormatted: [day, month] }) => (
          <>
            <span className="date-num">{day}</span> {month}
          </>
        ),
        {
          dateFormatted: new Intl.DateTimeFormat("ru-RU", {
            day: "numeric",
            month: "long",
          })
            .format(utils.itvWpDateTimeToDate(date))
            .split(" "),
        }
      )}
    </div>
  );
};

export default TaskTimelineDate;
