<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/ResultScreen.php';

use \ITV\models\ITVSingletonModel;
use ITV\dao\ResultScreen;

class ResultScreenshots extends ITVSingletonModel {
    protected static $_instance = null;
    
    public function __construct() {
        $itv_config = \ItvConfig::instance();
    }
    
    public function get_screenshots($user_id, $task_id) {
        $screens = ResultScreen::where(['user_id' => $user_id, 'task_id' => $task_id])->get();
        $res = [];
        
        foreach($screens as $index => $screen) {
            $name = 'screen-' + $index;
            $res[] = wp_get_attachment_image( $screen->image_id, 'avatar', false, array('alt' => $name, 'title'=> $name));
        }
        
        return $res;
    }
}
