import { ReactElement } from "react";

const TaskListFilter: React.FunctionComponent = (): ReactElement => {
  return (
    <section className="task-list-filter">
      <div className="filter-explain">
        Выберите категории задач, которые вам подоходят
      </div>
    </section>
  );
};

export default TaskListFilter;


/*

const filterSectionIcons = {
    tags: tagIconTags,
    ngo_tags: tagIconThemes,
    task_type: tagIconTaskType,
    author_type: tagIconAuthorType,
}

const filterTips = {
    newTaskNotif: 'newTaskNotif',
    subscribeAndEarnPoints: 'subscribeAndEarnPoints',
}

function TaskListFilter(props) {
    const user = useStoreState(store => store.user.data)
    const tipClose = useStoreState(store => store.taskListFilter.tipClose)
    const setTipClose = useStoreActions(actions => actions.taskListFilter.setTipClose)
    const saveTipClose = useStoreActions(actions => actions.taskListFilter.saveTipClose)
    const loadTipClose = useStoreActions(actions => actions.taskListFilter.loadTipClose)    

    // sections close state
    const sectionClose = useStoreState(store => store.taskListFilter.sectionClose)
    const setSectionClose = useStoreActions(actions => actions.taskListFilter.setSectionClose)
    const saveSectionClose = useStoreActions(actions => actions.taskListFilter.saveSectionClose)
    const loadSectionClose = useStoreActions(actions => actions.taskListFilter.loadSectionClose)    

    // option check state
    const optionCheck = useStoreState(store => store.taskListFilter.optionCheck)
    const setOptionCheck = useStoreActions(actions => actions.taskListFilter.setOptionCheck)
    const saveOptionCheck = useStoreActions(actions => actions.taskListFilter.saveOptionCheck)
    const loadOptionCheck = useStoreActions(actions => actions.taskListFilter.loadOptionCheck)    

    // filter data
    const filterData = useStoreState(store => store.taskListFilter.filterData)
    const isFilterDataLoaded = useStoreState(store => store.taskListFilter.isFilterDataLoaded)
    const loadFilterData = useStoreActions(actions => actions.taskListFilter.loadFilterData)        

    // subscription
    const subscribeTaskList = useStoreState(store => store.user.subscribeTaskList)
    const setSubscribeTaskList = useStoreActions(actions => actions.user.setSubscribeTaskList)
    const loadSubscribeTaskList = useStoreActions(actions => actions.user.loadSubscribeTaskList)

    useEffect(() => {
        loadFilterData()
        loadTipClose()
        loadOptionCheck()
    }, [])

    useEffect(() => {
        if(!user.id) {
            return
        }

        loadSubscribeTaskList()
    }, [user])

    function handleCloseTip(e, tipId) {
        e.preventDefault()
        setTipClose({...tipClose, [tipId]: true})
        saveTipClose()
    }

    function handleFilterOptionClick(e, optionId) {
        e.preventDefault()

        let newCheckValue = !_.get(optionCheck, optionId, false)

        if(newCheckValue) {
            setOptionCheck({...optionCheck, [optionId]: true})            
        }
        else {
            let optionCheckNew = {...optionCheck}
            delete optionCheckNew[optionId]
            setOptionCheck({...optionCheckNew})
        }
        
        saveOptionCheck()
    }

    function handleSubscribe(e) {
        e.preventDefault()

        let formData = new FormData()
        formData.append('filter', JSON.stringify(optionCheck))

        let action = 'subscribe-task-list'
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

                setSubscribeTaskList(optionCheck)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    function handleUnsubscribe(e) {
        e.preventDefault()

        let formData = new FormData()

        let action = 'unsubscribe-task-list'
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

                setSubscribeTaskList(null)
            },
            (error) => {
                utils.itvShowAjaxError({action, error})
            }
        )
    }

    function handleResetFilter(e) {
        e.preventDefault()

        setOptionCheck({})
        saveOptionCheck()
    }

    if(!isFilterDataLoaded) {
        return (
            <section className="task-list-filter">
            {utils.loadingWait()}
            </section>
        )   
    }

    return (
        <section className="task-list-filter">
            <div className="filter-explain">Выберите категории задач, которые вам подоходят</div>

            {!tipClose[filterTips.newTaskNotif] &&
            <div className="filter-tip">
                <div className="filter-tip-header">
                    <span className="filter-tip-title">
                        <img src={imgFilterMoodRock}/>
                        <span>Подсказка</span>
                    </span>
                    <a href="#" className="filter-tip-close" onClick={(e) => {handleCloseTip(e, filterTips.newTaskNotif)}}> </a>
                </div>
                Вы сможете получать уведомления о новых задачах
            </div>
            }

            <div className="filter-sections">
                {filterData.map((item, index) => {
                    return <FilterSection key={`filterSection${index}`} 
                        sectionData={item} 
                        optionCheck={optionCheck} 
                        optionClickHandler={handleFilterOptionClick}
                    />
                })}

                // markup example for options with folding
                
                <div className="filter-section d-none">
                    <div className="filter-section-title">
                        <img src={imgFilterTags}/>
                        <span>Категории</span>
                    </div>

                    <div className="filter-section-option-groups">
                        <div className="filter-section-option-list expand active">
                            <div className="filter-section-option-list-header">
                                <img src={imgFilterGalkaUp}/>
                                <span>Веб-сайты и разработка</span>
                            </div>
                            <div className="filter-section-option-list-items">
                                <div className="filter-section-option-list-item">
                                    <span className="check-title">
                                        <img src={_.get(optionCheck, "tags.banners", false) ? imgFilterCheckOn : imgFilterCheckOff}/>
                                        <span>Баннеры</span>
                                    </span>
                                    <span className="stats">28</span>
                                </div>
                                <div className="filter-section-option-list-item active">
                                    <span className="check-title">
                                        <img src={imgFilterCheckOn}/>
                                        <span>Веб-дизайн</span>
                                    </span>
                                    <span className="stats">28</span>
                                </div>
                            </div>
                        </div>

                        <div className="filter-section-option-list expand">
                            <div className="filter-section-option-list-header">
                                <span className="check-title">
                                    <img src={imgFilterGalkaDown}/>
                                    <span>Веб-сайты и разработка</span>
                                </span>
                                <span className="stats">33</span>
                            </div>
                            <div className="filter-section-option-list-items">
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {!tipClose[filterTips.subscribeAndEarnPoints] && 
            <div className="filter-tip after-filter">
                <div className="filter-tip-header">
                    <span className="filter-tip-title">
                        <img src={imgFilterAward}/>
                        <span>Награда</span>
                    </span>
                    <a href="#" className="filter-tip-close" onClick={(e) => {handleCloseTip(e, filterTips.subscribeAndEarnPoints)}}> </a>
                </div>
                Подпишитесь на уведомления и получите 500 баллов
            </div>
            }

            <div className="filter-actions">
                {subscribeTaskList === null && 
                <a href="#" className="filter-subscribe" onClick={(e) => {handleSubscribe(e)}}>Подписаться на уведомления</a>
                }
                <a href="#" className="filter-reset" onClick={(e) => {handleResetFilter(e)}}>Сбросить фильтры</a>
                {subscribeTaskList !== null && 
                <div className="already-subscribed">
                    <a href="#" className="filter-unsubscribe" onClick={(e) => {handleUnsubscribe(e)}}>Отменить подписку</a>
                    <span>У вас настроена рассылка на выбранные категории задач</span>
                </div>
                }
            </div>
        </section>
    )
}

function FilterSection(props) {
    const sectionId = _.get(props, "sectionData.id", "")
    const sectionTitle = _.get(props, "sectionData.title", "")
    const sectionIcon = _.get(filterSectionIcons, sectionId, "")
    const sectionItems = _.get(props, "sectionData.items", "")
    const optionClickHandler = props.optionClickHandler
    const optionCheck = props.optionCheck

    if(!sectionId) {
        return null
    }

    return (
        <div className="filter-section">
            <div className="filter-section-title">
                <img src={sectionIcon ? sectionIcon : imgFilterTaskList}/>
                <span>{sectionTitle}</span>
            </div>

            <div className="filter-section-option-groups">
                <div className="filter-section-option-list">
                    <div className="filter-section-option-list-items">
                        {sectionItems.map((item, index) => {
                            const optionId = sectionId + "." + item.id
                            return (
                                <div className={`filter-section-option-list-item ${_.get(optionCheck, optionId, false) ? "active" : ""}`} key={`filterSectionItem${sectionId}-${index}`}>
                                    <span className="check-title" onClick={(e) => {optionClickHandler(e, optionId)}}>
                                        <img src={_.get(optionCheck, optionId, false) ? imgFilterCheckOn : imgFilterCheckOff}/>
                                        <span>{item.title}</span>
                                    </span>
                                    <span className="stats">{item.task_count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskListFilter;

*/
