import { ReactElement, useState, useEffect } from "react";
import {
  IFetchResult,
} from "../../model/model.typing";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import * as utils from "../../utilities/utilities"
import * as _ from "lodash"

const TaskListNothingFound: React.FunctionComponent<{}> = ({}): ReactElement => {
  const setOptionCheck = useStoreActions(actions => actions.components.taskListFilter.setOptionCheck)
  const saveOptionCheck = useStoreActions(actions => actions.components.taskListFilter.saveOptionCheck)

  function handleResetFilter(e) {
      e.preventDefault()

      setOptionCheck({})
      saveOptionCheck()
  }  

  return (
      <div className="task-list-nothing-found-block">
        <h2>Нет подходящих задач</h2>
        <h3>Попробуйте смягчить условия поиска</h3>
        <a href="#" className="btn-reset-filter" onClick={handleResetFilter}>Сбросить фильтры</a>
      </div>
  )
}

export default TaskListNothingFound;
