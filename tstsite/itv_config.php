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
                'anna.ladoshkina@te-st.ru',
                'suvorov@te-st.ru',
            ),
            'CONSULT_EMAILS_GROUPS' => array (
                'audit' => array('anna.ladoshkina@te-st.ru', 'suvorov@te-st.ru'),
                #'audit' => array('denis.cherniatev@gmail.com'),
                'itv' => array('suvorov@te-st.ru', 'anna.ladoshkina@te-st.ru', 'support@te-st.ru'),
                #'itv' => array('support@te-st.ru'),
                #'itv' => array('suvorov@te-st.ru'),
                #'itv' => array('denis.cherniatev@gmail.com'),
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
            'USER_NOT_ACTIVATED_ALERT_TIME' => 9,
            'BULK_ACTIVATION_EMAIL_SEND_LIMIT' => 50,
            'REACTIVATION_EMAILS_LIMIT' => 2,
            'WEEKLY_STATS_EMAIL' => array(
                'PERIOD_DAYS' => 7,
                'TO_EMAIL' => 'wantprog@mail.ru',
                'CC_EMAILS' => array('denis.cherniatev@gmail.com'),
            ),
            
        );
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
