<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/ITVDAO.php';
require_once dirname(__FILE__) . '/../dao/Timeline.php';

use \ITV\dao\TimelineItem;
use \WeDevs\ORM\WP\User as User; 
use \WeDevs\ORM\WP\Post as Post; 

class TimelineModel extends ITVSingletonModel {
    protected static $_instance = null;
    
    public static $TYPE_PUBLICATION = 'publication';
    public static $TYPE_SEARCH_DOER = 'search_doer';
    public static $TYPE_WORK = 'work';
    public static $TYPE_DATE_SUGGEST = 'date_suggest';
    public static $TYPE_DATE_DECISION = 'date_decision';
    public static $TYPE_CLOSE_SUGGEST = 'close_suggest';
    public static $TYPE_CLOSE_DECISION = 'close_decision';
    public static $TYPE_CLOSE = 'close';
    public static $TYPE_REVIEW = 'review';
    
    public static $STATUS_PAST = 'past';
    public static $STATUS_CURRENT = 'current';
    public static $STATUS_FUTURE = 'future';

    public static $DECISION_ACCEPT = 'accept';
    public static $DECISION_REJECT = 'reject';
    
    private $TYPE_SORT = [];
    private $TYPE_TITLE = [];
    private $BASIC_TIMELINE_TYPES = [];
    private $BASIC_TIMELINE_INTERVAL_DAYS = [];
    
    public function __construct() {
        $this->TYPE_SORT = [
            TimelineModel::$TYPE_PUBLICATION => 0,
            TimelineModel::$TYPE_SEARCH_DOER => 30,
            TimelineModel::$TYPE_WORK => 30,
            TimelineModel::$TYPE_DATE_SUGGEST => 30,
            TimelineModel::$TYPE_DATE_DECISION => 30,
            TimelineModel::$TYPE_CLOSE_SUGGEST => 30,
            TimelineModel::$TYPE_CLOSE_DECISION => 30,
            TimelineModel::$TYPE_CLOSE => 50,
            TimelineModel::$TYPE_REVIEW => 100,
        ];

        $this->TYPE_TITLE = [
            TimelineModel::$TYPE_PUBLICATION => "Публикация задачи",
            TimelineModel::$TYPE_SEARCH_DOER => "Поиск волонтёра",
            TimelineModel::$TYPE_WORK => "Работа над проектом",
            TimelineModel::$TYPE_DATE_SUGGEST => "Предложена новая дата закрытия задачи:",
            TimelineModel::$TYPE_DATE_DECISION => [TimelineModel::$DECISION_ACCEPT => "Одобрена новая дата закрытия задачи", TimelineModel::$DECISION_REJECT => "Отклонена новая дата закрытия задачи"],
            TimelineModel::$TYPE_CLOSE_SUGGEST => "Предложено закрыть задачу",
            TimelineModel::$TYPE_CLOSE_DECISION => [TimelineModel::$DECISION_ACCEPT => "Одобрено предложение закрыть задачу", TimelineModel::$DECISION_REJECT => "Отклонено предложение закрыть задачу"],
            TimelineModel::$TYPE_CLOSE => "Завершение задачи",
            TimelineModel::$TYPE_REVIEW => "Отзывы о работе над задачей",
        ];
        
        $this->BASIC_TIMELINE_TYPES = [
            TimelineModel::$TYPE_PUBLICATION, 
            TimelineModel::$TYPE_SEARCH_DOER,
            TimelineModel::$TYPE_WORK,
            TimelineModel::$TYPE_CLOSE,
            TimelineModel::$TYPE_REVIEW,
        ];
        
        $this->BASIC_TIMELINE_INTERVAL_DAYS = [
            TimelineModel::$TYPE_PUBLICATION => 0,
            TimelineModel::$TYPE_SEARCH_DOER => 7,
            TimelineModel::$TYPE_WORK => 4,
            TimelineModel::$TYPE_CLOSE => 21,
            TimelineModel::$TYPE_REVIEW => 4,
        ];
    }
    
    public function get_task_timeline_items($task_id) {
        return $this->apply_order(TimelineItem::where(['task_id' => $task_id]))->get();
    }
    
    protected function apply_order($req) {
        return $req->orderBy('sort_order', 'DESC')->orderBy('id', 'DESC');
    }
    
    public function get_task_timeline($task_id) {
        $custom_items = $this->get_task_timeline_items($task_id);
        
        foreach($custom_items as $item) {
            if(in_array($item->type, [TimelineModel::$TYPE_DATE_DECISION, TimelineModel::$TYPE_CLOSE_DECISION])) {
                $item->title = !empty($this->TYPE_TITLE[$item->type][$item->decision]) ? $this->TYPE_TITLE[$item->type][$item->decision] : "";
            }
            else {
                $item->title = !empty($this->TYPE_TITLE[$item->type]) ? $this->TYPE_TITLE[$item->type] : ""; 
            }
            
            if($item->doer_id) {
                $doer = get_user_by("id", $item->doer_id);
                $item->doer = itv_get_user_in_gql_format($doer);
            }
            
            $item->isOverdue = in_array($item->type, [TimelineModel::$TYPE_SEARCH_DOER, TimelineModel::$TYPE_CLOSE, TimelineModel::$TYPE_REVIEW]) && strtotime($item->due_date) < strtotime(date('Y-m-d', time()));
        }
        
        return $custom_items;
    }
    
    public function add_item($task_id, $type, $args=array()) {
        
        $item = new TimelineItem();
        $item->type = $type;
        $item->task_id = $task_id;
        $item->sort_order = !empty($this->TYPE_SORT[$type]) ? $this->TYPE_SORT[$type] : 1;
        
        if(!empty($args['doer_id'])) {
            $item->doer_id = $args['doer_id'];
        }
        
        foreach($args as $k => $v) {
            $item->$k = $v;
        }

        if(empty($args['status'])) {
            $item->status = TimelineModel::$STATUS_CURRENT;
        }    
        
        if(empty($args['due_date'])) {
            // set due date
            $due_date = date( 'Y-m-d H:i:s' );
            $item->due_date = $due_date;
        }       
        
        $item->save();
    }
    
    public function get_next_checkpoint_date($date_mysql, $type) {
        $now_timestamp = strtotime($date_mysql);
        
        if(!empty($this->BASIC_TIMELINE_INTERVAL_DAYS[$type])) {
            $now_timestamp += 3600 * 24 * $this->BASIC_TIMELINE_INTERVAL_DAYS[$type];
        }
        
        return date( 'Y-m-d H:i:s', $now_timestamp );
    }
    
    public function create_task_timeline($task_id, $input_due_date = "") {
        $due_date = date( 'Y-m-d H:i:s', $input_due_date ? strtotime($input_due_date) : time() );
        
        foreach($this->BASIC_TIMELINE_TYPES as $type) {
            $args = [];
            if($type != TimelineModel::$TYPE_PUBLICATION) {
                $args['status'] = TimelineModel::$STATUS_FUTURE;
            }
            
            // set due date
            // $due_date = $this->get_next_checkpoint_date($due_date, $type);
            if($input_due_date && $type == TimelineModel::$TYPE_CLOSE) {
                $args['due_date'] = $due_date;
            }
            
            $this->add_item($task_id, $type, $args);
        }
    }
    
    public function complete_current_items($task_id) {
        $custom_items = TimelineItem::where(['task_id' => $task_id, 'status' => TimelineModel::$STATUS_CURRENT])->get();
        
        foreach($custom_items as $item) {
            $item->status = TimelineModel::$STATUS_PAST;
            $item->save();
        }
    }
    
    public function fix_current_items($task_id, $status) {
        $custom_items = TimelineItem::where(['task_id' => $task_id, 'status' => TimelineModel::$STATUS_CURRENT])->get();
        
        foreach($custom_items as $item) {
            $item->status = $status;
            $item->save();
        }
    }
    
    public function get_items($task_id, $type=null, $status=null) {
        $filter = ['task_id' => $task_id];
        
        if($type) {
            $filter['type'] = $type;
        }
        
        if($status) {
            $filter['status'] = $status;
        }
        
        return TimelineItem::where($filter)->orderBy('sort_order', 'DESC')->orderBy('id', 'DESC')->get();
    }

    public function get_item($item_id) {
        $filter = ['id' => $item_id];        
        return TimelineItem::where($filter)->first();
    }
    
    public function get_first_item($task_id, $type=null, $status=null) {
        $filter = ['task_id' => $task_id];
        
        if($type) {
            $filter['type'] = $type;
        }
        
        if($status) {
            $filter['status'] = $status;
        }
        
        return TimelineItem::where($filter)->orderBy('sort_order', 'DESC')->orderBy('id', 'DESC')->first();
    }
    
    public function make_future_item_current($task_id, $type, $args=array()) {
        $item = TimelineItem::where(['task_id' => $task_id, 'type' => $type, 'status' => TimelineModel::$STATUS_FUTURE])->orderBy('sort_order', 'DESC')->orderBy('id', 'ASC')->first();
        
        if($item) {
            $this->complete_current_items($task_id);
            $item->status = TimelineModel::$STATUS_CURRENT;

            foreach($args as $k => $v) {
                $item->$k = $v;
            }

            if($item->type !== TimelineModel::$TYPE_CLOSE) {
                $item->due_date = date( 'Y-m-d H:i:s' );
            }
            $item->save();
        }        
    }
    
    public function make_past_item_current($task_id, $type) {
        $item = $this->apply_order(TimelineItem::where(['task_id' => $task_id, 'type' => $type, 'status' => TimelineModel::$STATUS_PAST]))->first();
        
        if($item) {
            $this->fix_current_items($task_id, TimelineModel::$STATUS_FUTURE);
            $item->status = TimelineModel::$STATUS_CURRENT;
            $item->save();
        }        
    }
    
    public function add_current_item($task_id, $type, $args=array()) {
        $this->complete_current_items($task_id);
        $this->add_item($task_id, $type, $args);
    }

    public function delete_task_timeline($task_id) {
        TimelineItem::where(['task_id' => $task_id])->delete();
    }
}
