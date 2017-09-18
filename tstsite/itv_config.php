<?php
class ItvConfig {
    private $_config;
    private static $_instance = NULL;
    
    public function __construct() {
        
        // change ITV settings here:
        $this->_config = array (
            'ADMIN_EMAILS' => array (
                'support@te-st.ru',
                'suvorov@te-st.ru',
                'denis.cherniatev@gmail.com' 
            ),
            
            'TASK_COMLETE_NOTIF_EMAILS' => array (
                'vlad@te-st.ru',
                'suvorov@te-st.ru',
                'denis.cherniatev@gmail.com' 
            ),
            
            // ITV consultants emails list (for automatic consultation choose)
            'CONSULT_EMAILS' => array (
                'support@te-st.ru',
            ),
            'CONSULT_EMAILS_GROUPS' => array (
                'audit' => array('support@te-st.ru'),
                'itv' => array('support@te-st.ru'),
            ),
            'CONSULTANT_CONFIG' => array(
                'default' => array('time' => '12:00'),
                'support@te-st.ru' => array('time' => '13:00'),
            ),
            'CONSULT_BCC_EMAILS' => array (
                'denis.cherniatev@gmail.com',
                'sidorenko.a@gmail.com',
            ),
            
            'EMAIL_FROM' => 'info@itv.te-st.ru',
            'CONSULT_EMAIL_FROM' => 'support@te-st.ru',
            'TASK_ARCHIVE_DAYS' => 40,
            'TASK_NO_DOER_NOTIF_DAYS' => 9,
            'TASK_LONG_WORK_NOTIF_DAYS' => 90,
            'TASK_LONG_WORK_ARCHIVE_DAYS' => 99,
            'USER_NOT_ACTIVATED_ALERT_TIME' => 9,
            'BULK_ACTIVATION_EMAIL_SEND_LIMIT' => 50,
            'REACTIVATION_EMAILS_LIMIT' => 2,
            'WEEKLY_STATS_EMAIL' => array(
                'PERIOD_DAYS' => 7,
                'TO_EMAIL' => 'suvorov@te-st.ru',
                'CC_EMAILS' => array('denis.cherniatev@gmail.com', 'vlad@te-st.ru', 'sidorenko.a@gmail.com'),
            ),
            
            'USER_ACTION_XP' => [
                'register' => 30,
                // once in profile lifeime per field
                'fill_field' => 1,
                // once in profile lifeime
                'upload_photo' => 20,
                'add_comment' => 1,
                'create_task' => -10,
                // when restore activity suppose member connected as doer in 24 hours after task created date
                'add_as_candidate' => 15,
                'add_as_candidate_0617' => 2,
                'cancel_as_candidate_0617' => -2,
                // when restore activity suppose doer complete task in 14 days after task created date
                'task_done' => 100,
                'my_task_done' => 20,
                'review_for_doer' => 10,
                'review_for_author' => 10,
                'login' => 1,
                'thankyou' => 1,
            ],
            'USER_ACTION_XP_ALERT' => [
                'always' => ['actions' => ['register', 'task_done', 'create_task', 'my_task_done']],
                'never' => ['actions' => ['login']],
                'less_only' => [
                    ['limit' => 20, 'actions' => ['fill_field', 'upload_photo', 'add_comment', 'add_as_candidate', 'add_as_candidate_0617', 'review_for_doer', 'review_for_author']],
                ]
            ],
            'ALERT_TEAM' => array (
                'vlad@te-st.ru',
                'suvorov@te-st.ru',
                'denis.cherniatev@gmail.com'
            ),
            'RESULT_SCREENSHOTS' => [
                'limit' => 6,
            ],
        );
        
        $this->_config['THANKYOU'] = [
            'MIN_INTERVAL' => 1, # minutes
            'TOO_MUCH' => 30,
            'TOO_MUCH_ALERT_TEAM' => $this->_config['ALERT_TEAM'],
            'PERIOD_LIMIT' => 10, # times
            'PERIOD_LIMIT_PERIOD' => 3600 * 24, # seconds
        ];
        
    }
    
    public static function instance() {
        if (ItvConfig::$_instance == NULL) {
            ItvConfig::$_instance = new ItvConfig ();
        }
        return ItvConfig::$_instance;
    }
    
    public function get($option_name) {
        return isset ( $this->_config [$option_name] ) ? $this->_config [$option_name] : null;
    }
}
