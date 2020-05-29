import { ReactElement, useState, useEffect } from "react";
import Link from "next/link";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import Loader from "../Loader";

import metaIconCalendar from '../../assets/img/icon-calc.svg';
import iconApproved from '../../assets/img/icon-all-done.svg';

const TaskList: React.FunctionComponent<{

}> = ({}): ReactElement => {

  const { 
    items,
    isTaskListLoaded,
    optionCheck,
    statusStats,

  } = useStoreState((state) => state.components.taskList);

  const resetTaskListLoaded = useStoreActions((actions) => actions.components.taskList.resetTaskListLoaded);

    // load more
    const [page, setPage] = useState(1)
    const [isLoadMoreTaskCount, setIsLoadMoreTaskCount] = useState(true)

    async function loadFilteredTaskList(optionCheck, page) {
        let isLoadMore = page > 1

        if(!isLoadMore) {
            resetTaskListLoaded()
        }

        let formData = new FormData()
        formData.append('page', page)
        formData.append('filter', JSON.stringify(optionCheck))
/*
        let action = 'get-task-list'
        fetch(utils.itvAjaxUrl(action), {
            method: 'post',
            body: formData,
        })
        .then(res => {
            try {
                return res.json()
            } catch(ex) {
                utils.itvShowAjaxError({action, error: ex})
                return {}
            }
        })
        .then(
            (result) => {
                if(result.status == 'fail') {
                    return utils.itvShowAjaxError({message: result.message})
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
                utils.itvShowAjaxError({action, error})
            }
        )
        */
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
                {/*
                    <UserSmallView user={task.author} />
                    {!!task.author.organizationName &&
                    <UserSmallView user={{
                        itvAvatar: task.author.organizationLogo,
                        fullName: task.author.organizationName,
                        memberRole: "Организация",
                    }} />
                    }
                */}
                </div>                
                <h1>
                <Link href="/tasks/[slug]" as={`/tasks/${task.slug}`}>
                    <a dangerouslySetInnerHTML={{__html: task.title}}/>
                </Link>
                </h1>
                <div className="meta-info">
                    <div className="tooltip itv-approved">
                        <div className="tooltip-buble">
                            Мы проверили, задача хорошая
                        </div>
                        <img src={iconApproved} className="tooltip-actor itv-approved" />
                    </div>    
                    {/*
                    <TaskMetaInfo icon={metaIconCalendar} title={format(utils.itvWpDateTimeToDate(task.dateGmt), 'do MMMM Y', {locale: ru})}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`Открыто ${formatDistanceToNow(utils.itvWpDateTimeToDate(task.dateGmt), {locale: ru, addSuffix: true})}`}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`${task.doerCandidatesCount} откликов`}/>
                    <TaskMetaInfo icon={metaIconCalendar} title={`${task.viewsCount} просмотров`}/>

                    <a href="#" className="share-task">
                        <TaskMetaInfo icon={metaIconShare} title="Поделиться"/>
                    </a>
                  */}
                </div>
                { !!task.featuredImage &&
                    <div className="cover" />
                }
                { !!task.content &&
                    <div className="task-content" dangerouslySetInnerHTML={{__html: task.content}} />
                }
                {/*
                {(!!task.tags.nodes.length || !!task.ngoTaskTags.nodes || !!task.rewardTags.nodes) &&
                <div className="meta-terms">

                    {!!task.tags.nodes.length &&
                    <TaskMetaTerms icon={tagIconTags} tags={task.tags.nodes}/>
                    }

                    {!!task.ngoTaskTags.nodes.length &&
                    <TaskMetaTerms icon={tagIconThemes} tags={task.ngoTaskTags.nodes}/>
                    }
                    
                    {!!task.rewardTags.nodes.length &&
                    <TaskMetaTerms icon={tagIconReward} tags={task.rewardTags.nodes}/>
                    }
                </div>
                }
                */}
    </div>)
}

export default TaskList;
