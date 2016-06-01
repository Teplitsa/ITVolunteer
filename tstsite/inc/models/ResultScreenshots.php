<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/ResultScreen.php';

use \ITV\models\ITVSingletonModel;
use ITV\dao\ResultScreen;

class ResultScreenshots extends ITVSingletonModel {
    protected static $_instance = null;
    private $config = [];
    
    public function __construct() {
        $itv_config = \ItvConfig::instance();
        $this->config = $itv_config->get('RESULT_SCREENSHOTS');
    }
    
    public function get_user_screenshots($user_id, $task_id) {
        $screens = ResultScreen::where(['user_id' => $user_id, 'task_id' => $task_id])->get();
        $res = [];
        
        foreach($screens as $index => $screen) {
            $res[] = $screen;
        }
        
        return $res;
    }
    
    public function get_screenshots($task_id) {
        $screens = ResultScreen::where(['task_id' => $task_id])->get();
        $res = [];
    
        foreach($screens as $index => $screen) {
            $res[] = $screen;
        }
    
        return $res;
    }
    
    public function is_upload_allowed($user_id, $task_id) {
        $task = get_post($task_id);
        $is_allowed = false;
        
        if($task->post_status == 'closed' && tst_is_user_candidate($user_id, $task_id) > 1) {
            $is_allowed = true;
        }
        
        return $is_allowed;
    }
    
    public function is_limit($user_id, $task_id) {
        $screens_count = ResultScreen::where(['user_id' => $user_id, 'task_id' => $task_id])->count();
        return $screens_count >= $this->config['limit'];
    }
    
    public function ajax_upload_screenshot($member, $task_id) {

        $res = null;
        $is_error = false;
        
        if(!$member) {
            $res = array(
                'status' => 'error',
                'message' => 'restricted method',
            );
            $is_error = true;
        }
        elseif(!$task_id) {
            $res = array(
                'status' => 'error',
                'message' => 'task not found',
            );
            $is_error = true;
        }
        
        if(!$is_error) {
            if($this->is_limit($member->ID, $task_id)) {
                $res = array(
                    'status' => 'error',
                    'is_limit' => true,
                    'message' => 'screens limit exceeded',
                );
                $is_error = true;
            }
        }
        
        if(!$is_error) {
        
            $image_id = media_handle_upload( 'res_screen', 0 );
            $attach_data = wp_generate_attachment_metadata( $image_id, get_attached_file( $image_id ) );
            wp_update_attachment_metadata( $image_id,  $attach_data );
        
            if( $image_id ) {
                $res_screen = new ResultScreen();
                $res_screen->user_id = $member->ID;
                $res_screen->task_id = $task_id;
                $res_screen->image_id = $image_id;
                $res_screen->moment = current_time('mysql');
                $res_screen->save();
        
                $res = array(
                    'status' => 'ok',
                    'screen_id' => $res_screen->id,
                    'is_limit' => $this->is_limit($member->ID, $task_id),
                    'image' => str_replace(array('<', '>'), '', wp_get_attachment_image( $image_id, 'avatar' )),
                    'full_image_src' => $res_screen->get_full_image_src(),
                );
            } else {
                $res = array(
                    'status' => 'error',
                    'message' => 'upload image error',
                );
            }
        }
        
        if($res === null) {
            $res = array(
                'status' => 'error',
                'message' => 'unkown error',
            );
        }
        
        return $res;
    }
    
    public function ajax_delete_screenshot($member, $screen_id) {
        $res = null;
        if(!$member) {
            $res = array(
                'status' => 'error',
                'message' => 'restricted method',
            );
        }
        else {
            error_log(print_r(['user_id' => $member->ID, 'id' => $screen_id], true));
            $screen = ResultScreen::where(['user_id' => $member->ID, 'id' => $screen_id])->first();
            $image_id = $screen ? $screen->image_id : 0;
            if( $image_id ) {
                wp_delete_attachment( $image_id, true );
                $screen->forceDelete();
                
                $res = array(
                    'status' => 'ok',
                );
            } else {
                $res = array(
                    'status' => 'error',
                    'message' => 'image not found',
                );
            }
        }
        
        if($res === null) {
            $res = array(
                'status' => 'error',
                'message' => 'unkown error',
            );
        }
        
        return $res;
    }
}
