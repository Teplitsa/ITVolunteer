import { ReactElement, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import { IFetchResult } from "../../model/model.typing";
import * as utils from "../../utilities/utilities";
import * as _ from "lodash";

import TaskListFilterLoader from "../skeletons/partials/TaskListFilter";
import Tooltip from "../global-scripts/Tooltip";
import tooltipStyles from "../../assets/sass/modules/Tooltip.module.scss";

import imgFilterMoodRock from "../../assets/img/icon-filter-mood-rock.svg";
import imgFilterAward from "../../assets/img/icon-filter-award.svg";
import tagIconTags from "../../assets/img/icon-filter-tiles.svg";
import tagIconThemes from "../../assets/img/icon-filter-fire.svg";
import tagIconTaskType from "../../assets/img/icon-filter-task-list.svg";
import tagIconAuthorType from "../../assets/img/icon-filter-fire.svg";
import imgFilterCheckOn from "../../assets/img/icon-filter-check-on.svg";
import imgFilterCheckOff from "../../assets/img/icon-filter-check-off.svg";
import imgFilterCheckSemi from "../../assets/img/icon-filter-check-semi.svg";
import imgFilterTaskList from "../../assets/img/icon-filter-task-list.svg";

const filterSectionIcons = {
  tags: tagIconTags,
  ngo_tags: tagIconThemes,
  task_type: tagIconTaskType,
  author_type: tagIconAuthorType,
};

const filterTips = {
  newTaskNotif: "newTaskNotif",
  subscribeAndEarnPoints: "subscribeAndEarnPoints",
};

const TaskListFilter: React.FunctionComponent = (): ReactElement => {
  const isSessionLoaded = useStoreState(store => store.session.isLoaded);

  const tipClose = useStoreState(store => store.components.taskListFilter.tipClose);
  const setTipClose = useStoreActions(actions => actions.components.taskListFilter.setTipClose);
  const saveTipClose = useStoreActions(actions => actions.components.taskListFilter.saveTipClose);
  const loadTipClose = useStoreActions(actions => actions.components.taskListFilter.loadTipClose);

  // sections close state

  // option check state
  const optionCheck = useStoreState(store => store.components.taskListFilter.optionCheck);
  const setOptionCheck = useStoreActions(
    actions => actions.components.taskListFilter.setOptionCheck
  );
  const saveOptionCheck = useStoreActions(
    actions => actions.components.taskListFilter.saveOptionCheck
  );
  const loadOptionCheck = useStoreActions(
    actions => actions.components.taskListFilter.loadOptionCheck
  );

  // option check state
  const optionOpen = useStoreState(store => store.components.taskListFilter.optionOpen);
  const setOptionOpen = useStoreActions(actions => actions.components.taskListFilter.setOptionOpen);
  const saveOptionOpen = useStoreActions(
    actions => actions.components.taskListFilter.saveOptionOpen
  );
  const loadOptionOpen = useStoreActions(
    actions => actions.components.taskListFilter.loadOptionOpen
  );

  // filter data
  const filterData = useStoreState(store => store.components.taskListFilter.filterData);
  const isFilterDataLoaded = useStoreState(
    store => store.components.taskListFilter.isFilterDataLoaded
  );
  const loadFilterData = useStoreActions(
    actions => actions.components.taskListFilter.loadFilterData
  );

  // subscription
  const subscribeTaskList = useStoreState(store => store.session.user.subscribeTaskList);
  const setSubscribeTaskList = useStoreActions(actions => actions.session.setSubscribeTaskList);
  const loadSubscribeTaskList = useStoreActions(actions => actions.session.loadSubscribeTaskList);

  const router = useRouter();

  function findCheckedItem(items, checkedSlug) {
    let foundItem = null;
    for (const i in items) {
      const itemData = items[i];
      // console.log("itemData.slug:", itemData.slug);

      if (itemData.slug === checkedSlug) {
        foundItem = itemData;
      } else {
        foundItem = findCheckedItem(itemData.subterms, checkedSlug);
      }

      if (foundItem) {
        break;
      }
    }

    return foundItem;
  }

  useEffect(() => {
    // console.log("task list FRONT running...");
    loadTipClose();
    loadOptionCheck();
    loadOptionOpen();
  }, []);

  useEffect(() => {
    loadFilterData({taskStatus: optionCheck ? optionCheck.status : "publish"});
  }, [optionCheck?.status]);

  const tasks_by_tag_handled = useRef(false);
  useEffect(() => {
    if ( !isFilterDataLoaded || tasks_by_tag_handled.current ) {
      return;
    }

    const match = router.asPath.match(/\/tasks\/tag\/([-_a-z0-9]+)\/?/);
    // console.log("match:", match);

    if (match) {
      let foundCheckId = "";
      filterData.find(sectionData => {
        // console.log("sectionData:", sectionData);

        if (sectionData.id === "tags") {
          const foundItem = findCheckedItem(sectionData.items, match[1]);
          // console.log("foundItem:", foundItem);

          if (foundItem) {
            foundCheckId = "tags." + foundItem.id;
            return true;
          }
        }

        return false;
      });

      setOptionCheck({ [foundCheckId]: true });
        tasks_by_tag_handled.current = true;
      saveOptionCheck();
    }
  }, [filterData, isFilterDataLoaded, tasks_by_tag_handled]);

  useEffect(() => {
    if ( !isFilterDataLoaded || tasks_by_tag_handled.current ) {
      return;
    }

    const match = router.asPath.match(/\/tasks\/nko-tag\/([-_a-z0-9]+)\/?/);
    // console.log("match:", match);

    if (match) {
      let foundCheckId = "";
      filterData.find(sectionData => {
        // console.log("sectionData:", sectionData);

        if (sectionData.id === "ngo_tags") {
          const foundItem = findCheckedItem(sectionData.items, match[1]);
          // console.log("foundItem:", foundItem);

          if (foundItem) {
            foundCheckId = "ngo_tags." + foundItem.id;
            return true;
          }
        }

        return false;
      });

      // console.log("foundCheckId:", foundCheckId);

      setOptionCheck({ [foundCheckId]: true });
        tasks_by_tag_handled.current = true;
      saveOptionCheck();
    }
  }, [filterData, isFilterDataLoaded, tasks_by_tag_handled]);

  useEffect(() => {
    if (!isSessionLoaded) {
      return;
    }

    loadSubscribeTaskList();
  }, [isSessionLoaded]);

  function handleCloseTip(e, tipId) {
    e.preventDefault();
    setTipClose({ ...tipClose, [tipId]: true });
    saveTipClose();
  }

  function handleFilterOptionCheck(e, optionId, subterms) {
    e.preventDefault();

    const isChecked = _.get(optionCheck, optionId, false);
    const hasSubterms = !!subterms && subterms.length > 0;
    const isSemiChecked =
      !isChecked &&
      hasSubterms &&
      subterms.findIndex(subItem => {
        const subItemOptionId = optionId.replace(/\.\d+$/, "." + subItem.id);
        return _.get(optionCheck, subItemOptionId, false) === true;
      }) > -1;
    const newCheckValue = !isChecked && isSemiChecked ? false : !isChecked;

    if (newCheckValue) {
      const optionCheckNew = { ...optionCheck };
      optionCheckNew[optionId] = true;

      for (const si in subterms) {
        const subItem = subterms[si];
        const subItemOptionId = optionId.replace(/\.\d+$/, "." + subItem.id);
        optionCheckNew[subItemOptionId] = true;
      }

      setOptionCheck(optionCheckNew);
    } else {
      const optionCheckNew = { ...optionCheck };
      delete optionCheckNew[optionId];

      if (!isChecked && hasSubterms) {
        for (const si in subterms) {
          const subItem = subterms[si];
          const subItemOptionId = optionId.replace(/\.\d+$/, "." + subItem.id);
          delete optionCheckNew[subItemOptionId];
        }
      }

      setOptionCheck({ ...optionCheckNew });
    }

    saveOptionCheck();
  }

  function handleFilterOptionOpen(e, optionId) {
    e.preventDefault();

    const newOpenValue = !_.get(optionOpen, optionId, false);

    if (newOpenValue) {
      setOptionOpen({ ...optionOpen, [optionId]: true });
    } else {
      const optionOpenNew = { ...optionOpen };
      delete optionOpenNew[optionId];
      setOptionOpen({ ...optionOpenNew });
    }

    saveOptionOpen();
  }

  function handleSubscribe(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("filter", JSON.stringify(optionCheck));

    const action = "subscribe-task-list";
    utils
      .tokenFetch(utils.getAjaxUrl(action), {
        method: "post",
        body: formData,
      })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "fail") {
            return utils.showAjaxError({ message: result.message });
          }

          setSubscribeTaskList(optionCheck);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }

  function handleUnsubscribe(e) {
    e.preventDefault();

    const formData = new FormData();

    const action = "unsubscribe-task-list";
    utils
      .tokenFetch(utils.getAjaxUrl(action), {
        method: "post",
        body: formData,
      })
      .then(res => {
        try {
          return res.json();
        } catch (ex) {
          utils.showAjaxError({ action, error: ex });
          return {};
        }
      })
      .then(
        (result: IFetchResult) => {
          if (result.status == "fail") {
            return utils.showAjaxError({ message: result.message });
          }

          setSubscribeTaskList(null);
        },
        error => {
          utils.showAjaxError({ action, error });
        }
      );
  }

  function handleResetFilter(e) {
    e.preventDefault();

    setOptionCheck({});
    saveOptionCheck();
  }

  if (!isFilterDataLoaded) {
    return <TaskListFilterLoader />;
  }

  // console.log("render filter...");

  return (
    <section className="task-list-filter">
      <div className="filter-explain">Выберите категории задач, которые вам интересны</div>

      {!tipClose[filterTips.newTaskNotif] && (
        <div className="filter-tip">
          <div className="filter-tip-header">
            <span className="filter-tip-title">
              <img src={imgFilterMoodRock} />
              <span>Подсказка</span>
            </span>
            <a
              href="#"
              className="filter-tip-close"
              onClick={e => {
                handleCloseTip(e, filterTips.newTaskNotif);
              }}
            >
              {" "}
            </a>
          </div>
          Вы сможете получать уведомления о новых задачах
        </div>
      )}

      <div className="filter-sections">
        {filterData.map((item, index) => {
          return (
            <FilterSection
              key={`filterSection${index}`}
              sectionData={item}
              optionCheck={optionCheck}
              optionOpen={optionOpen}
              optionCheckHandler={handleFilterOptionCheck}
              optionOpenHandler={handleFilterOptionOpen}
            />
          );
        })}
      </div>

      {!tipClose[filterTips.subscribeAndEarnPoints] && (
        <div className="filter-tip after-filter">
          <div className="filter-tip-header">
            <span className="filter-tip-title">
              <img src={imgFilterAward} />
              <span>Награда</span>
            </span>
            <a
              href="#"
              className="filter-tip-close"
              onClick={e => {
                handleCloseTip(e, filterTips.subscribeAndEarnPoints);
              }}
            >
              {" "}
            </a>
          </div>
          Подпишитесь на уведомления и получите 50 баллов
        </div>
      )}

      <div className="filter-actions">
        {subscribeTaskList === null && (
          <a
            href="#"
            className="filter-subscribe btn btn_primary btn_full-width"
            onClick={e => {
              handleSubscribe(e);
            }}
          >
            Подписаться на уведомления
          </a>
        )}
        <a
          href="#"
          className="filter-reset btn btn_default btn_full-width"
          onClick={e => {
            handleResetFilter(e);
          }}
        >
          Сбросить фильтры
        </a>
        {subscribeTaskList !== null && (
          <div className="already-subscribed">
            <a
              href="#"
              className="filter-unsubscribe"
              onClick={e => {
                handleUnsubscribe(e);
              }}
            >
              Отменить подписку
            </a>
            <span>У вас настроена подписка на выбранную категорию задач</span>
          </div>
        )}
      </div>
    </section>
  );
};

function FilterSection(props) {
  const sectionId = _.get(props, "sectionData.id", "");
  const sectionTitle = _.get(props, "sectionData.title", "");
  const sectionIcon = _.get(filterSectionIcons, sectionId, "");
  const sectionItems = _.get(props, "sectionData.items", []);

  if (!sectionId || !sectionItems) {
    return null;
  }

  return (
    <div className="filter-section">
      <div className="filter-section-title">
        <img src={sectionIcon ? sectionIcon : imgFilterTaskList} />
        <span>{sectionTitle}</span>
      </div>

      <div className="filter-section-option-groups">
        <FilterSectionItems {...props} />
      </div>
    </div>
  );
}

function FilterSectionItems(props) {
  const sectionId = _.get(props, "sectionData.id", "");
  const sectionItems = _.get(props, "sectionData.items", []);
  const optionCheckHandler = props.optionCheckHandler;
  const optionOpenHandler = props.optionOpenHandler;
  const optionCheck = props.optionCheck;
  const optionOpen = props.optionOpen;
  const isSubTermsList = _.get(props, "isSubTermsList", false);

  return (
    <div className={`filter-section-option-list ${isSubTermsList && "sub-terms-list"}`}>
      <div className="filter-section-option-list-items">
        {sectionItems.map((item, index) => {
          const optionId = sectionId + "." + item.id;
          const hasSubterms = !!item.subterms && item.subterms.length > 0;
          const subtermsSectionData = _.cloneDeep(_.get(props, "sectionData"));
          subtermsSectionData.items = hasSubterms ? _.cloneDeep(item.subterms) : [];
          // console.log("optionId:", optionId);
          // console.log("slug:", item.slug);
          // console.log("subterms:", item.subterms);
          // console.log("optionCheck:", optionCheck);
          // console.log("items:", sectionData.items)

          const isChecked = _.get(optionCheck, optionId, false);
          const isSemiChecked =
            !isChecked &&
            hasSubterms &&
            item.subterms.findIndex(subItem => {
              const subItemOptionId = sectionId + "." + subItem.id;
              return _.get(optionCheck, subItemOptionId, false) === true;
            }) > -1;
          // console.log("hasSubterms:", hasSubterms);
          // console.log("isChecked:", isChecked);
          // console.log("isSemiChecked:", isSemiChecked);

          return (
            <div
              className={`filter-section-option-list-item ${
                (isChecked || isSemiChecked) && "active"
              } ${hasSubterms && "has-subterms"}`}
              key={`filterSectionItem${sectionId}-${index}`}
            >
              <div className={`filter-section-option-list-item-title`}>
                <span className="check-title">
                  <img
                    onClick={e => {
                      optionCheckHandler(e, optionId, item.subterms);
                    }}
                    src={
                      isChecked
                        ? imgFilterCheckOn
                        : isSemiChecked
                        ? imgFilterCheckSemi
                        : imgFilterCheckOff
                    }
                  />
                  <span
                    style={
                      (optionId.search("for-paseka-members") !== -1 && { display: "flex" }) || null
                    }
                    onClick={e => {
                      optionOpenHandler(e, optionId);
                    }}
                  >
                    {item.title}
                    {optionId.search("for-paseka-members") !== -1 && (
                      <>
                        <span style={{ marginLeft: "7px" }} />
                        <Tooltip>
                          <button
                            className={tooltipStyles["tooltip__component-btn"]}
                            type="button"
                            data-tooltip-btn={true}
                          />
                          <div
                            className={tooltipStyles["tooltip__component-body"]}
                            data-tooltip-body={true}
                          >
                            Заказчик ищет опытного исполнителя или команду,<br />и у задачи есть бюджет
                          </div>
                        </Tooltip>
                      </>
                    )}
                  </span>
                </span>
                <span className="stats">{item.task_count}</span>
              </div>
              {hasSubterms && _.get(optionOpen, optionId, false) && (
                <FilterSectionItems
                  {...props}
                  sectionData={subtermsSectionData}
                  isSubTermsList={true}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskListFilter;
