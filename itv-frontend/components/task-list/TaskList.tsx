import { ReactElement, useState, useEffect } from "react";
import Link from "next/link";
import {
  IFetchResult,
} from "../../model/model.typing";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Loader from "../Loader";
import {UserSmallView} from "../UserView"
import TaskListNothingFound from "./TaskListNothingFound"
import TaskMeta from "../task/task-header/TaskMeta";
import TaskTags from "../task/task-header/TaskTags";
import * as utils from "../../utilities/utilities"
import * as _ from "lodash"

import metaIconCalendar from '../../assets/img/icon-calc.svg';
import iconApproved from '../../assets/img/icon-all-done.svg';

const TaskList: React.FunctionComponent<{

}> = ({}): ReactElement => {

  const items = useStoreState((state) => state.components.taskList.items)
  const isTaskListLoaded = useStoreState((state) => state.components.taskList.isTaskListLoaded)

  const resetTaskListLoaded = useStoreActions((actions) => actions.components.taskList.resetTaskListLoaded);

  const optionCheck = useStoreState(store => store.components.taskListFilter.optionCheck)
  const statusStats = useStoreState(store => store.components.taskListFilter.statusStats)

  // load more
  const [page, setPage] = useState(1)
  const [isLoadMoreTaskCount, setIsLoadMoreTaskCount] = useState(true)
  const appendTaskList = useStoreActions(actions => actions.components.taskList.appendTaskList)
  const setTaskList = useStoreActions(actions => actions.components.taskList.setTaskList)  

  async function loadFilteredTaskList(optionCheck, page) {
      let isLoadMore = page > 1

      if(!isLoadMore) {
          resetTaskListLoaded()
      }

      let formData = new FormData()
      formData.append('page', page)
      formData.append('filter', JSON.stringify(optionCheck))

      let action = 'get-task-list'
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

              setIsLoadMoreTaskCount(result.taskList.length > 0)

              if(isLoadMore) {
                  appendTaskList(result.taskList)
              }
              else {
                  setTaskList(result.taskList)
              }
          },
          (error) => {
              utils.showAjaxError({action, error})
          }
      )
  }

  useEffect(() => {
      if(optionCheck === null) {
          return
      }

      loadFilteredTaskList(optionCheck, page)
  }, [page, optionCheck])

  useEffect(() => {
      if(optionCheck === null) {
          return
      }

      resetTaskListLoaded()
      setPage(1)
  }, [optionCheck])

  useEffect(() => {
      if(optionCheck === null) {
          return
      }

      if(statusStats === null) {
          return
      }

      let totalTasksCount = statusStats[optionCheck ? optionCheck.status : "publish"]
      setIsLoadMoreTaskCount(totalTasksCount > items.length)

  }, [statusStats, optionCheck, items])

  function handleLoadMoreTasks(e) {
      e.preventDefault()
      setPage(page + 1)
  }

  if(!isTaskListLoaded) {
      return (
          <section className="task-list">
            <Loader />
          </section>
      )
  }

  return (
      <section className="task-list">
          {items && items.map((task, key) => <TaskListItem task={task} key={`taskListItem${key}`} />)}
          {isLoadMoreTaskCount &&
          <div className="load-more-tasks">
              <a href="#" className="btn btn-load-more" onClick={handleLoadMoreTasks}>Загрузить ещё</a>
          </div>
          }
          {!items.length &&
            <TaskListNothingFound />
          }
      </section>
  )
}

function TaskListItem(props) {
    const task = props.task

    if(!task) {
        return null
    }

    return (<div className="task-body">                    
                <div className="task-author-meta">
                  <UserSmallView user={task.author} />
                  {!!task.author.organizationName &&
                  <UserSmallView user={{
                      itvAvatar: task.author.organizationLogo,
                      fullName: task.author.organizationName,
                      memberRole: "Организация",
                  }} />
                  }
                </div>                
                <h1>
                <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
                    <a dangerouslySetInnerHTML={{__html: task.title}}/>
                </Link>
                </h1>
                <TaskMeta task={task}/>
                { !!task.featuredImage &&
                    <div className="cover" />
                }
                { !!task.content &&
                    <div className="task-content" dangerouslySetInnerHTML={{__html: task.content}} />
                }
                <TaskTags task={task} />
    </div>)
}

export default TaskList;
