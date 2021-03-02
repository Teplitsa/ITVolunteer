import { ReactElement, useEffect, useRef } from "react";
import Router from "next/router";
// import { IFetchResult } from "../model/model.typing";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../model/helpers/hooks";
import { UserSmallPicView } from "../components/UserView";
import * as utils from "../utilities/utilities";
import * as _ from "lodash";

import logoNoText from "../assets/img/pic-logo-itv-notext.svg";
import iconNotifRock from "../assets/img/icon-filter-mood-rock.svg";

const ITV_USER_NOTIF_TEXT = {
  task_published: "Вы опубликовали новую задачу",
  post_comment_taskauthor: "прокомментировал(а) вашу задачу",
  post_comment_user: "Вы прокомментировали задачу",
  reaction_to_task_user: "Вы откликнулись на задачу",
  reaction_to_task_taskauthor: "откликнулся на задачу",
  task_approved_taskauthor: "Модератор одобрил вашу задачу",
  task_disapproved_taskauthor: "Вы выбрали волонтёра для задачи",
  choose_taskdoer_to_taskdoer: "выбрал(а) вас на задачу",
  choose_taskdoer_to_taskauthor: "Вы выбрали волонтёра для задачи",
  choose_other_taskdoer: "выбрал(а) другого исполнителя на задачу",
  deadline_update_taskauthor: "Вы изменили дедлайн задачи",
  deadline_update_taskdoer: "изменил(а) дедлайн задачи",
  suggest_new_deadline_to_taskauthor: "предложил(а) новый дедлайн задачи",
  suggest_new_deadline_to_taskdoer: "Вы предложили новый дедлайн задачи",
  suggest_task_close_to_taskauthor: "предложил(а) закрыть задачу",
  reject_task_close_to_taskdoer: "отклонил(а) предложение закрыть задачу",
  task_closing_taskauthor: "Вы закрыли задачу",
  task_closing_taskdoer: "закрыл(а) задачу",
  post_feedback_taskauthor_to_taskdoer: "оставил(а) вам отзыв по задаче",
  post_feedback_taskdoer_to_taskdoer: "Вы оставили отзыв автору задачи",
  post_feedback_taskauthor_to_taskauthor: "Вы оставили отзыв волонтёру по задаче",
  post_feedback_taskdoer_to_taskauthor: "оставил(а) вам отзыв по задаче",
  reaction_to_task_back: "отозвал свой отклик на задачу",
  decline_doer_to_taskdoer: "отклонил(а) вас в качестве исполнителя задачи",
};

export function NotifList({
  clickOutsideHandler,
}: {
  clickOutsideHandler: () => void;
}): ReactElement {
  const user = useStoreState(store => store.session.user);
  const notifList = useStoreState(store => store.components.userNotif.notifList);
  const notifListRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: Event): void => {
    if (notifListRef.current?.contains(event.target as Node)) return;

    clickOutsideHandler && clickOutsideHandler();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={`notif-list`} ref={notifListRef}>
      <div className={`notif-list__container`}>
        <div className="notif-list__title">Оповещения</div>
        {notifList.map((item, index) => {
          return <NotifItem key={`NotifListItem${index}`} notif={item} user={user} />;
        })}
      </div>
      {/* <div className="notif-list__view-all">
        <a href="#">Все оповещения</a>
      </div> */}
    </div>
  );
}

function NotifItem({ notif, user }) {
  // const removeNotifFromList = useStoreActions(
  //   actions => actions.components.userNotif.removeNotifFromList
  // );
  const setCompleteTaskWizardState = useStoreActions(
    actions => actions.components.completeTaskWizard.setInitState
  );

  // function handleNotifItemClick() {
  //   removeNotifFromList(notif);

  //   const formData = new FormData();
  //   formData.append("notifIdList[]", notif.id);

  //   const action = "set_user_notif_read";
  //   fetch(utils.getAjaxUrl(action), {
  //     method: "post",
  //     body: formData,
  //   })
  //     .then(res => {
  //       try {
  //         return res.json();
  //       } catch (ex) {
  //         utils.showAjaxError({ action, error: ex });
  //         return {};
  //       }
  //     })
  //     .then(
  //       (result: IFetchResult) => {
  //         if (result.status == "error") {
  //           return utils.showAjaxError({ message: result.message });
  //         }
  //       },
  //       error => {
  //         utils.showAjaxError({ action, error });
  //       }
  //     );
  // }

  const completeTask = () => {
    setCompleteTaskWizardState({
      user: { databaseId: user.databaseId, name: user.fullName, isAuthor: false, slug: user.slug },
      partner: {
        databaseId: notif.from_user.databaseId,
        name: notif.from_user.fullName,
        slug: notif.from_user.slug,
      },
      task: { databaseId: notif.task.databaseId, title: notif.task.title, slug: notif.task.slug },
    });

    Router.push({
      pathname: "/task-complete",
    });
  };

  return (
    <div className={`notif-list__item ${notif.is_read ? "notif-list__item__read" : ""}`}>
      <div className="notif-list__item-content">
        <div className="notif-list__item-icon">
          {(!notif.from_user || notif.from_user.id === user.id) && <img src={logoNoText} alt="" />}
          {!!notif.from_user && notif.from_user.id !== user.id && (
            <UserSmallPicView user={notif.from_user} />
          )}
        </div>
        <div className="notif-list__item-body">
          <div className="notif-list__item-title">
            {!!notif.from_user && notif.from_user.id !== user.id && (
              <a href={notif.from_user.profileURL}>
                <b>{notif.from_user.fullName}</b>
              </a>
            )}

            {notif.type === "general_notif" ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: notif.content || "",
                }}
              />
            ) : (
              <span>{_.get(ITV_USER_NOTIF_TEXT, notif.type, "")}</span>
            )}
          </div>

          {!!notif.task && (
            <Link href="/tasks/[slug]" as={`/tasks/${notif.task.slug}`}>
              <a
                className="notif-list__item-task"
                dangerouslySetInnerHTML={{ __html: notif.task.title }}
              />
            </Link>
          )}

          {notif.type === "post_feedback_taskauthor_to_taskdoer" && (
            <div className="notif-list__leave-review">
              <a
                href="#"
                className="btn btn_primary"
                onClick={event => {
                  event.preventDefault();
                  completeTask();
                }}
              >
                Оставить отзыв
              </a>
            </div>
          )}

          <div className="notif-list__item-time">
            <img src={iconNotifRock} alt="" />
            <span>{`${utils.formatIntervalToNow({
              fromDate: utils.itvWpDateTimeToDate(notif.dateGmt),
            })}`}</span>
          </div>
        </div>
        {/* <a href="#" className="notif-list__item-set-read" onClick={handleNotifItemClick}></a> */}
      </div>
    </div>
  );
}

export default NotifList;
