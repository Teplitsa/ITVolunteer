import { ReactElement } from "react";
import { ITaskDoer } from "../../model/model.typing";
import * as utils from "../../utilities/utilities";

const TaskDoerStats: React.FunctionComponent<{
  doer: ITaskDoer,
  isApproved?: boolean,
}> = ({
  doer,
  isApproved=false
}): ReactElement => {
  const {
    solvedTasksCount,
    doerReviewsCount,
    portfolioItemsCount,
    isPasekaMember,
  } = doer;

  return (
    <>
      {doerReviewsCount > 0 || solvedTasksCount > 0
        ?
        <>
          <span className="reviews">{`${doerReviewsCount}  ${utils.getReviewsCountString(
            doerReviewsCount
          )}`}</span>
          <span className="status">{`Решено задач: ${solvedTasksCount}`}</span>
        </>
        :
        <>
          {isPasekaMember
            ?
            <>
              <span className="status">{`Проектов в портфолио: ${portfolioItemsCount}`}</span>
              {isPasekaMember && !isApproved &&
                <span className="item-label item-label-paseka">Рекомендуем</span>
              }
            </>
            :
            <span className="item-label item-label-newbie">Новичок. Нужен шанс!</span>
          }
        </>
      }
    </>
  );
};

export default TaskDoerStats;
