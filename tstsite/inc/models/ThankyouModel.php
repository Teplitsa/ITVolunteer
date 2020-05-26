<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/UserXP.php';
require_once dirname(__FILE__) . '/../dao/Review.php';

use \ITV\models\ITVSingletonModel;
use \ITV\models\UserXPModel;
use \ITV\dao\ThankYou;
use \WeDevs\ORM\WP\User as User;

class ThankyouModel extends ITVSingletonModel {
    protected static $_instance = null;
    private $THANKYOU_CONFIG;
    
    public function __construct() {
        $this->THANKYOU_CONFIG = \ItvConfig::instance()->get('THANKYOU');
    }
    
    public function do_thankyou($from_uid, $to_uid) {
        $user_id = $from_uid;
        
        $query = ThankYou::where('from_uid', $user_id)->where('to_uid', $to_uid);
        $thankyou = $query->first();
        
        if($thankyou) {
            if($this->is_said_recently_condition($thankyou)) {
                throw new ItvThankyouRecentlySaidException();
            }
        }
        else {
            $thankyou = new ThankYou();
            $thankyou->from_uid = $user_id;
            $thankyou->to_uid = $to_uid;
            $thankyou->counter = 0;
            $thankyou->is_too_much_sent = false;
        }
        
        $thankyou->counter += 1;
        $thankyou->moment = current_time('mysql');
        $thankyou->save();
        
        UserXPModel::instance()->register_activity($to_uid, UserXPModel::$ACTION_THANKYOU);
        $to_user = User::find($to_uid);
        \ItvLog::instance()->log_user_action(\ItvLog::$ACTION_USER_THANKYOU, $user_id, '', $to_user->user_login);
        
        $from_user = User::find($user_id);
        
        ItvAtvetka::instance()->mail('thankyou_notification', [
            'user_id' => $to_user->ID,
            'to_username' => $to_user->display_name,
            'from_username' => $from_user->display_name,
            'thankyou_xp' => UserXPModel::instance()->get_action_xp(UserXPModel::$ACTION_THANKYOU),
        ]);
        
        if($thankyou->counter > $this->THANKYOU_CONFIG['TOO_MUCH'] && !$thankyou->is_too_much_sent && count($this->THANKYOU_CONFIG['TOO_MUCH_ALERT_TEAM'])) {
            
            $subject = \ItvEmailTemplates::instance()->get_title('too_much_thankyou');
            $message = \ItvEmailTemplates::instance()->get_text('too_much_thankyou');
            
            $data = array(
                'from_username' => $from_user->display_name,
                'from_user_url' => tst_get_member_url($from_user),
                'to_username' => $to_user->display_name,
                'to_user_url' => tst_get_member_url($to_user),
                'last_moment' => $thankyou->moment,
                'limit' => $this->THANKYOU_CONFIG['TOO_MUCH'],
            );
            $message = nl2br($message);
            $message = itv_fill_template($message, $data);
            
            if(itv_html_email_with_cc($this->THANKYOU_CONFIG['TOO_MUCH_ALERT_TEAM'], $subject, $message)) {
                $thankyou->is_too_much_sent = true;
                $thankyou->save();
            }
        }
    }
    
    public function is_said_recently($from_uid, $to_uid) {
        $ret = false;
        
        $query = ThankYou::where('from_uid', $from_uid)->where('to_uid', $to_uid);
        $thankyou = $query->first();
        
        if($thankyou) {
            $ret = $this->is_said_recently_condition($thankyou);
        }
        
        return $ret;
    }
    
    private function is_said_recently_condition($thankyou) {
        return strtotime($thankyou->moment) > current_time('timestamp') - $this->THANKYOU_CONFIG['MIN_INTERVAL'] * 60;
    }

    public function get_user_thankyou_count($to_uid) {
        $query = ThankYou::where('to_uid', $to_uid);
        return $query->sum('counter');
    }

    public function is_yourself($user_id, $to_uid) {
        return $user_id == $to_uid;
    }
    
    public function is_limit_exceeded($user_id) {
        $thankyou_count = \ItvLog::instance()->count_user_actions_for_period($user_id, 'user_thankyou', date('Y-m-d H:i:s', time() - $this->THANKYOU_CONFIG['PERIOD_LIMIT_PERIOD']));
        return $thankyou_count >= $this->THANKYOU_CONFIG['PERIOD_LIMIT'];
    }
}

/* exceptions */
class ItvThankyouRecentlySaidException extends \Exception {
}
