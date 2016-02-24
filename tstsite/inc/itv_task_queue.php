<?php
class ItvTaskQueue {
    public static $TYPE_USER_REPORT = 1;
    
    public static $STATUS_NEW = 'NEW';
    public static $STATUS_RUN = 'RUN';
    public static $STATUS_DONE = 'DONE';
    public static $STATUS_ERROR = 'ERROR';
    
    private $wpdb = null;
	
	public function __construct($wpdb) {
	    $this->wpdb = $wpdb;
	}
	
	public function fetch_task($type) {
	    return false;
	}
}
