import { ReactElement } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";

const TaskReplyStatus: React.FunctionComponent = (): ReactElement => {
  const { isLoggedIn, isTaskAuthorLoggedIn } = useStoreState(
    (state) => state.session
  );
  const { approvedDoer, doers } = useStoreState(
    (state) => state.components.task
  );
  const addDoer = useStoreActions(
    (actions) => actions.components.task?.addDoerRequest
  );

  return (
    !approvedDoer && (
      <>
        {!doers?.length && <h2>Откликов пока нет</h2>}

        {!doers?.length && isLoggedIn && !isTaskAuthorLoggedIn && (
          <div className="sidebar-users-block no-responses">
            <p>Откликов пока нет. Воспользуйся возможностью получить задачу</p>
          </div>
        )}

        {doers?.length < 2 && isTaskAuthorLoggedIn && (
          <div className="sidebar-users-block no-responses">
            <p>
              Мало просмотров и откликов на задачу? Возможно,{" "}
              <Link href="/sovety-dlya-nko-uspeshnye-zadachi/">
                <a target="_blank">наши советы помогут вам</a>
              </Link>
            </p>
          </div>
        )}
      </>
    )
  );
};

export default TaskReplyStatus;
