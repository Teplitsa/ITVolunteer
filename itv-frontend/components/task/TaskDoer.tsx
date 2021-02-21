import { ReactElement, useState, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { ITaskDoer } from "../../model/model.typing";
import * as utils from "../../utilities/utilities";
import TaskAuthorActionsOnDoer from "./TaskAuthorActionsOnDoer";

import IconPaseka from "../../assets/img/icon-paseka.svg";
import MemberAvatarDefault from "../../assets/img/member-default.svg";

const TaskDoer: React.FunctionComponent<ITaskDoer> = (doer): ReactElement => {
  const [isAvatarImageValid, setAvatarImageValid] = useState<boolean>(false);
  const { id: taskId, doers } = useStoreState(state => state.components.task);
  const {
    manageDoerRequest: manageDoer,
    updateApprovedDoer,
    updateDoers,
    taskRequest,
    timelineRequest,
  } = useStoreActions(actions => actions.components.task);
  const {
    fullName,
    profileURL: toProfile,
    itvAvatar: avatarImage,
    solvedTasksCount,
    doerReviewsCount,
    isPasekaMember,
  } = doer;
  const approveFn = manageDoer.bind(null, {
    action: "approve-candidate",
    taskId,
    doer,
    callbackFn: function () {
      updateApprovedDoer(doer);
      taskRequest();
      timelineRequest();
    },
  });
  const declineFn = manageDoer.bind(null, {
    action: "decline-candidate",
    taskId,
    doer,
    callbackFn: updateDoers.bind(
      null,
      doers.filter(({ id }) => id !== doer.id)
    ),
  });

  useEffect(() => {
    const abortController = new AbortController();

    try {
      avatarImage &&
        avatarImage.search(/temp-avatar\.png/) === -1 &&
        utils.tokenFetch(avatarImage, {
          signal: abortController.signal,
          mode: "no-cors",
        }).then(response => setAvatarImageValid(response.ok));
    } catch (error) {
      console.error(error);
    }

    return () => abortController.abort();
  }, []);

  return (
    <div className="user-card">
      <div className="user-card-inner">
        <div
          className={`avatar-wrapper ${isAvatarImageValid ? "" : "avatar-wrapper_medium-image"}`}
          style={{
            backgroundImage: isAvatarImageValid
              ? `url(${avatarImage})`
              : `url(${MemberAvatarDefault})`,
          }}
        >
          {isPasekaMember && <img src={IconPaseka} className="itv-approved" />}
        </div>
        <div className="details">
          <a className="name" href={toProfile}>
            {fullName}
          </a>
          <span className="reviews">{`${doerReviewsCount}  ${utils.getReviewsCountString(
            doerReviewsCount
          )}`}</span>
          <span className="status">{`Выполнено ${solvedTasksCount} задач`}</span>
        </div>
      </div>
      <TaskAuthorActionsOnDoer approve={approveFn} decline={declineFn} />
    </div>
  );
};

export default TaskDoer;
