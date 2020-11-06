import { ReactElement } from "react";
import { useStoreActions } from "../../model/helpers/hooks";

const TaskListNothingFound: React.FunctionComponent = (): ReactElement => {
  const setOptionCheck = useStoreActions(
    actions => actions.components.taskListFilter.setOptionCheck
  );
  const saveOptionCheck = useStoreActions(
    actions => actions.components.taskListFilter.saveOptionCheck
  );

  function handleResetFilter(e) {
    e.preventDefault();

    setOptionCheck({});
    saveOptionCheck();
  }

  return (
    <div className="task-list-nothing-found-block">
      <h2>Нет подходящих задач</h2>
      <h3>Попробуйте смягчить условия поиска</h3>
      <a href="#" className="btn-reset-filter" onClick={handleResetFilter}>
        Сбросить фильтры
      </a>
    </div>
  );
};

export default TaskListNothingFound;
