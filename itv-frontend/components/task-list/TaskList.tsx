import { ReactElement, useState, useEffect } from "react";
import { IFetchResult, ITaskState } from "../../model/model.typing";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Loader from "../Loader";
import TaskListItem from "./TaskListItem";
import TaskListNothingFound from "./TaskListNothingFound";
import * as utils from "../../utilities/utilities";

const TaskList: React.FunctionComponent = (): ReactElement => {
  const items = useStoreState((state) => state.components.taskList.items);
  const isTaskListLoaded = useStoreState(
    (state) => state.components.taskList.isTaskListLoaded
  );

  const resetTaskListLoaded = useStoreActions(
    (actions) => actions.components.taskList.resetTaskListLoaded
  );

  const optionCheck = useStoreState(
    (store) => store.components.taskListFilter.optionCheck
  );
  const statusStats = useStoreState(
    (store) => store.components.taskListFilter.statusStats
  );

  // load more
  const [page, setPage] = useState(1);
  const [isLoadMoreTaskCount, setIsLoadMoreTaskCount] = useState(true);
  const appendTaskList = useStoreActions(
    (actions) => actions.components.taskList.appendTaskList
  );
  const setTaskList = useStoreActions(
    (actions) => actions.components.taskList.setTaskList
  );

  async function loadFilteredTaskList(optionCheck, page) {
    let isLoadMore = page > 1;

    if (!isLoadMore) {
      resetTaskListLoaded();
    }

    let formData = new FormData();
    formData.append("page", page);
    formData.append("filter", JSON.stringify(optionCheck));

    let action = "get-task-list";
    fetch(utils.getAjaxUrl(action), {
      method: "post",
      body: formData,
    })
      .then((res) => {
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

          setIsLoadMoreTaskCount(result.taskList.length > 0);

          if (isLoadMore) {
            appendTaskList(result.taskList);
          } else {
            setTaskList(result.taskList);
          }
        },
        (error) => {
          utils.showAjaxError({ action, error });
        }
      );
  }

  useEffect(() => {
    if (optionCheck === null) {
      return;
    }

    loadFilteredTaskList(optionCheck, page);
  }, [page, optionCheck]);

  useEffect(() => {
    if (optionCheck === null) {
      return;
    }

    resetTaskListLoaded();
    setPage(1);
  }, [optionCheck]);

  useEffect(() => {
    if (optionCheck === null) {
      return;
    }

    if (statusStats === null) {
      return;
    }

    let totalTasksCount =
      statusStats[optionCheck ? optionCheck.status : "publish"];
    setIsLoadMoreTaskCount(totalTasksCount > items.length);
  }, [statusStats, optionCheck, items]);

  function handleLoadMoreTasks(e) {
    e.preventDefault();
    setPage(page + 1);
  }

  return (
    (isTaskListLoaded && (
      <section className="task-list">
        {items?.map((task) => (
          <TaskListItem
            key={`taskListItem-${task.id}`}
            {...(task as ITaskState)}
          />
        ))}
        {isLoadMoreTaskCount && (
          <div className="load-more-tasks">
            <a
              href="#"
              className="btn btn-load-more"
              onClick={handleLoadMoreTasks}
            >
              Загрузить ещё
            </a>
          </div>
        )}
        {!items?.length && <TaskListNothingFound />}
      </section>
    )) || (
      <section className="task-list">
        <Loader />
      </section>
    )
  );
};

export default TaskList;
