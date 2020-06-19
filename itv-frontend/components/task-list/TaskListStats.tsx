import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import {
  IFetchResult,
} from "../../model/model.typing";
import * as _ from "lodash"
import * as utils from "../../utilities/utilities"

const statusFilterTitle = {
    publish: "Ожидают волонтеров",
    in_work: "В работе",
    closed: "Решено",
}

const TaskListStats: React.FunctionComponent = (): ReactElement => {

  const optionCheck = useStoreState(store => store.components.taskListFilter.optionCheck)
  const setOptionCheck = useStoreActions(actions => actions.components.taskListFilter.setOptionCheck)
  const saveOptionCheck = useStoreActions(actions => actions.components.taskListFilter.saveOptionCheck)

  const statusStats = useStoreState(store => store.components.taskListFilter.statusStats)
  const setStatusStats = useStoreActions((actions) => actions.components.taskListFilter.setStatusStats);

  const router = useRouter()
  // const { slug } = router.query

  useEffect(() => {
      if(optionCheck === null) {
          return
      }

      let formData = new FormData()
      formData.append('filter', JSON.stringify(optionCheck))

      let action = 'get-task-status-stats'
      fetch(utils.getAjaxUrl(action), {
          method: 'post',
          body: formData,
      })
      .then(res => {
          try {
              return res.json()
          } catch(ex) {
              utils.showAjaxError({action, error: ex})
              return {}
          }
      })
      .then(
          (result: IFetchResult) => {
              if(result.status == 'fail') {
                  return utils.showAjaxError({message: result.message})
              }

              setStatusStats(result.stats)
          },
          (error) => {
              utils.showAjaxError({action, error})
          }
      )
  }, [optionCheck])

  useEffect(() => {
    let statusMatch = router.asPath.match(/\/tasks\/(publish|closed|in_work)\/?/)
    if(statusMatch) {
      setOptionCheck({...optionCheck, status: statusMatch[1]})
      saveOptionCheck()
    }
  }, [])

  function statusFilterClickHandler(e, status) {
      e.preventDefault()
      setOptionCheck({...optionCheck, status: status})
      saveOptionCheck()
  }

  return (
    <div className="stats">
        {["publish", "in_work", "closed"].map((status, index) => {
            return (
                <span 
                    className={((!_.get(optionCheck, "status") && status === "publish") || _.get(optionCheck, "status") ===  status) ? "active" : ""} 
                    key={`StatusFilterItem${index}`} 
                    onClick={(e) => {statusFilterClickHandler(e, status)}}
                >
                    {`${statusFilterTitle[status]}: ${_.get(statusStats, status, "")}`}
                </span>
            )
        })}
    </div>
  );
};

export default TaskListStats;
