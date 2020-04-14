<?php

set_time_limit (0);
ini_set('memory_limit','256M');

include('cli_common.php');
require_once get_template_directory() . '/vendor/autoload.php';
require_once(dirname(__FILE__) . '/../inc/models/TimelineModel.php');

use ITV\models\TimelineModel;
use ITV\dao\TimelineItem;

try {
	$time_start = microtime(true);
	echo 'Memory before anything: '.memory_get_usage(true).chr(10).chr(10);
	
	$options = getopt("", array('task:'));
	$task_id = isset($options['task']) ? $options['task'] : '';
	
    $params = array(
        'post_type'        => 'tasks',
        'fields'           => 'ids',
        'posts_per_page'   => -1,
        'numberposts'      => -1,
        'suppress_filters' => true,
    );
    
    if($task_id) {
        $params['post__in'] = [$task_id];
    }
    
	$get_posts = new WP_Query;
	$post_id_list = $get_posts->query( $params );
	
// 	print_r($params);
// 	print_r($post_id_list);
// 	exit();
    
    $timeline = ITV\models\TimelineModel::instance();
    foreach($post_id_list as $post_id) {
        echo "post: $post_id\n"; 
        $post = get_post($post_id);
        
        $timeline->delete_task_timeline($post_id);        
        $timeline->create_task_timeline($post_id);
        
        $task_timeline = [];
        $task_timeline_iter = TimelineItem::where(['task_id' => $post_id])->orderBy('sort_order', 'DESC')->orderBy('id', 'DESC')->get();
        foreach($task_timeline_iter as $timeline_item) {
            $task_timeline[] = $timeline_item;
        }
        $task_timeline = array_reverse($task_timeline);
        
        $doers = tst_get_task_doers($post->ID, true);
        $doer_id = !empty($doers) ? $doers[0]->ID : null;

        if($post->post_status == 'closed') {
            $active_item_type = TimelineModel::$TYPE_CLOSE;
        }
        elseif($post->post_status == 'in_work') {
            $active_item_type = TimelineModel::$TYPE_WORK;
        }
        elseif($post->post_status == 'publish') {
            $active_item_type = TimelineModel::$TYPE_SEARCH_DOER;
            $doer_id = null;
        }
        else {
            $active_item_type = "";
            $doer_id = null;
        }
        
        if(!$active_item_type) {
            continue;
        }
        
        foreach($task_timeline as $timeline_item) {
            if($doer_id && !in_array($timeline_item->type, [TimelineModel::$TYPE_SEARCH_DOER, TimelineModel::$TYPE_PUBLICATION])) {
                $timeline_item->doer_id = $doer_id;
            }
            
            if($timeline_item->type === $active_item_type) {
                $timeline_item->status = TimelineModel::$STATUS_CURRENT;
                $timeline_item->save();
                break;
            }
            else {
                $timeline_item->status = TimelineModel::$STATUS_PAST;
                $timeline_item->save();
            }
        }
    }
	
	echo 'DONE'.chr(10);

	//Final
	echo 'Memory '.memory_get_usage(true).chr(10);
	echo 'Total execution time in sec: ' . (microtime(true) - $time_start).chr(10).chr(10);
    
}
catch (ItvNotCLIRunException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (ItvCLIHostNotSetException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (Exception $ex) {
	echo $ex;
}
