import { ReactElement, useEffect } from "react";
import { useStoreState, useStoreActions } from "../../model/helpers/hooks";
import {
  IFetchResult,
} from "../../model/model.typing";
import * as utils from "../../utilities/utilities"
import * as _ from "lodash"

import Loader from "../Loader"

import imgFilterMoodRock from '../../assets/img/icon-filter-mood-rock.svg'
import imgFilterAward from '../../assets/img/icon-filter-award.svg'
import imgFilterTags from '../../assets/img/icon-color-picker.svg'
import imgFilterPeople from '../../assets/img/icon-people.svg'
import tagIconTags from '../../assets/img/icon-color-picker.svg'
import tagIconThemes from '../../assets/img/icon-people.svg'
import tagIconTaskType from '../../assets/img/icon-filter-task-list.svg'
import tagIconAuthorType from '../../assets/img/icon-people.svg'
import imgFilterCheckOn from '../../assets/img/icon-filter-check-on.svg'
import imgFilterCheckOff from '../../assets/img/icon-filter-check-off.svg'
import imgFilterTaskList from '../../assets/img/icon-filter-task-list.svg'
import imgFilterGalkaDown from '../../assets/img/icon-filter-galka-down.svg'
import imgFilterGalkaUp from '../../assets/img/icon-filter-galka-up.svg'

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

const TaskListFilter: React.FunctionComponent = (): ReactElement => {
  const user = useStoreState(store => store.session.user)
  const tipClose = useStoreState(store => store.components.taskListFilter.tipClose)
  const setTipClose = useStoreActions(actions => actions.components.taskListFilter.setTipClose)
  const saveTipClose = useStoreActions(actions => actions.components.taskListFilter.saveTipClose)
  const loadTipClose = useStoreActions(actions => actions.components.taskListFilter.loadTipClose)    

  // sections close state
  const sectionClose = useStoreState(store => store.components.taskListFilter.sectionClose)
  const setSectionClose = useStoreActions(actions => actions.components.taskListFilter.setSectionClose)
  const saveSectionClose = useStoreActions(actions => actions.components.taskListFilter.saveSectionClose)
  const loadSectionClose = useStoreActions(actions => actions.components.taskListFilter.loadSectionClose)    

  // option check state
  const optionCheck = useStoreState(store => store.components.taskListFilter.optionCheck)
  const setOptionCheck = useStoreActions(actions => actions.components.taskListFilter.setOptionCheck)
  const saveOptionCheck = useStoreActions(actions => actions.components.taskListFilter.saveOptionCheck)
  const loadOptionCheck = useStoreActions(actions => actions.components.taskListFilter.loadOptionCheck)    

  // filter data
  const filterData = useStoreState(store => store.components.taskListFilter.filterData)
  const isFilterDataLoaded = useStoreState(store => store.components.taskListFilter.isFilterDataLoaded)
  const loadFilterData = useStoreActions(actions => actions.components.taskListFilter.loadFilterData)        

  // subscription
  const subscribeTaskList = useStoreState(store => store.session.user.subscribeTaskList)
  const setSubscribeTaskList = useStoreActions(actions => actions.session.setSubscribeTaskList)
  const loadSubscribeTaskList = useStoreActions(actions => actions.session.loadSubscribeTaskList)

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

              setSubscribeTaskList(optionCheck)
          },
          (error) => {
              utils.showAjaxError({action, error})
          }
      )
  }

  function handleUnsubscribe(e) {
      e.preventDefault()

      let formData = new FormData()

      let action = 'unsubscribe-task-list'
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

              setSubscribeTaskList(null)
          },
          (error) => {
              utils.showAjaxError({action, error})
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
          <Loader />
          </section>
      )   
  }

  return (
      <section className="task-list-filter">
          <div className="filter-explain">Выберите категории задач, которые вам интересны</div>

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
              Подпишитесь на уведомления и получите 50 баллов
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
                  <span>У вас настроена подписка на выбранную категорию задач</span>
              </div>
              }
          </div>
      </section>
  );
};

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
