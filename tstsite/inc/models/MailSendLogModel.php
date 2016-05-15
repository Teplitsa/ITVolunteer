<?php
namespace ITV\models;

require_once 'ITVModel.php';
require_once dirname(__FILE__) . '/../dao/Mail.php';

use ITV\dao\MailSendLog;

class MailSendLogModel extends ITVSingletonModel {
    protected static $_instance = null;
    
    public function log_send_action($args) {
        $mail_log = new MailSendLog();
        $mail_log->subject = $args['subject'];
        $mail_log->save();
    }
    
    public function get_send_email_count_for_week($from, $to) {
        if($from && !preg_match('/.* \d{2}:\d{2}:\d{2}$/', $from)) {
            $from .= ' 00:00:00';
        }
        
        $query = MailSendLog::where('created_at', '>=', $from);
        if($to) {
            if(!preg_match('/.* \d{2}:\d{2}:\d{2}$/', $to)) {
                $to .= ' 00:00:00';
            }
            $query->where('created_at', '<', $to);
        }
        
        return $query->count();
    }
}
