<?php

class ItvConfig {
	private $_config;
	private static $_instance = NULL;

	public function __construct() {
		
		// change ITV settings here:
		$this->_config = array(
			'ADMIN_EMAILS' => array('support@te-st.ru', 'suvorov@te-st.ru', 'denis.cherniatev@gmail.com'),
			'TASK_COMLETE_NOTIF_EMAILS' => array('vlad@te-st.ru', 'suvorov@te-st.ru', 'denis.cherniatev@gmail.com'),
			'CONSULT_EMAILS' => array('anna.ladoshkina@te-st.ru', 'denis.cherniatev@gmail.com'),
			'EMAIL_FROM' => 'info@itv.te-st.ru',
			'CONSULT_EMAIL_FROM' => 'anna.ladoshkina@te-st.ru',
			'TASK_ARCHIVE_DAYS' => 31,
			'TASK_ARCHIVE_SOON_NOTIF_DAYS' => 24,
			'TASK_NO_DOER_NOTIF_DAYS' => 7,
		);
		
	}
	
	public static function instance() {
		if(ItvConfig::$_instance == NULL) {
			ItvConfig::$_instance = new ItvConfig();
		}
		return ItvConfig::$_instance;
	}
	
	public function get($option_name) {
		return isset($this->_config[$option_name]) ? $this->_config[$option_name] : null;
	}
	
}
