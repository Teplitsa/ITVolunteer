import { ReactElement, useState, useEffect } from "react";
import { ITaskState } from "../../../model/model.typing";
import {
  FacebookShareButton,
  TelegramShareButton,
  VKShareButton,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon, TelegramIcon, VKIcon, WhatsappIcon } from "react-share";
import TaskMetaItem from "./TaskMetaItem";
import iconApproved from "../../../assets/img/icon-all-done.svg";
import metaIconCalendar from "../../../assets/img/icon-calc.svg";
import metaIconShare from "../../../assets/img/icon-share.svg";
import * as utils from "../../../utilities/utilities";

const TaskMeta: React.FunctionComponent<ITaskState> = ({
  dateGmt,
  doerCandidatesCount,
  viewsCount,
  isApproved,
  pemalinkPath,
}): ReactElement => {
  const [isShowShareButtons, setIsShowShareButtons] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const withMetaIconCalendar: Array<string> = [
    utils.formatDate({ date: utils.itvWpDateTimeToDate(dateGmt) }),
    `Открыто ${utils.getTheIntervalToNow({
      fromDateString: dateGmt,
    })}`,
    `${doerCandidatesCount} откликов`,
    `${viewsCount} просмотров`,
  ];

  const toggleShareButtons = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsShowShareButtons(!isShowShareButtons);
  };

  useEffect(() => {
    setShareUrl(utils.getSiteUrl(pemalinkPath));
  }, []);

  return (
    <div className="meta-info">
      {isApproved && <img src={iconApproved} className="itv-approved" />}
      {withMetaIconCalendar.map((title, i) => {
        return (
          <TaskMetaItem
            key={utils.generateUniqueKey({
              base: title,
              prefix: "TaskMetaItem",
            })}
          >
            <img src={metaIconCalendar} />
            <span>{title}</span>
          </TaskMetaItem>
        );
      })}
      <TaskMetaItem>
        <span className="meta-info-share">
          <img src={metaIconShare} />
          <a href="#" className="share-task" onClick={toggleShareButtons}>
            <span>Поделиться</span>
          </a>
          {isShowShareButtons && (
            <span className="task-share-buttons">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <TelegramShareButton url={shareUrl}>
                <TelegramIcon size={32} round={true} />
              </TelegramShareButton>
              <VKShareButton url={shareUrl}>
                <VKIcon size={32} round={true} />
              </VKShareButton>
              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
            </span>
          )}
        </span>
      </TaskMetaItem>
    </div>
  );
};

export default TaskMeta;
