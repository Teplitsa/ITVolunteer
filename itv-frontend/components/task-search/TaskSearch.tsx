import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import { ITaskState } from "../../model/model.typing";
import GlobalScripts, { ISnackbarMessage } from "../../context/global-scripts";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import TaskSearchForm from "./TaskSearchForm";
import TaskListItem from "../task-list/TaskListItem";

const { SnackbarContext } = GlobalScripts;

const TaskSearch: React.FunctionComponent = (): ReactElement => {
  const {
    query: { s },
  } = useRouter();
  const items = useStoreState((state) => state.components.taskList.items);
  const hasMoreTasks = useStoreState(
    (state) => state.entrypoint.archive.hasNextPage
  );
  const loadMoreTasksRequest = useStoreActions(
    (actions) => actions.components.taskList.loadMoreTasksRequest
  );

  return (
    <>
      <div className="search-phrase">
        <p>
          По поисковому запросу &laquo;
          <span className="search-phrase__value">{s}</span>&raquo;
        </p>
      </div>
      <SnackbarContext.Consumer>
        {({ dispatch }) => {
          const addSnackbar = (message: ISnackbarMessage) => {
            dispatch({ type: "add", payload: { messages: [message] } });
          };
          return <TaskSearchForm {...{ addSnackbar }} />;
        }}
      </SnackbarContext.Consumer>
      {s && (
        <section className="task-list">
          {items?.map((task) => (
            <TaskListItem
              key={`taskListItem-${task.id}`}
              {...(task as ITaskState)}
            />
          ))}
          {hasMoreTasks && (
            <div className="load-more-tasks">
              <a
                href="#"
                className="btn btn-load-more"
                onClick={(event) => {
                  event.preventDefault();
                  loadMoreTasksRequest({ searchPhrase: s as string });
                }}
              >
                Загрузить ещё
              </a>
            </div>
          )}
          {!items?.length && (
            <p>Не найдены задачи, соответствующие критериям поиска.</p>
          )}
        </section>
      )}
    </>
  );
};

export default TaskSearch;
