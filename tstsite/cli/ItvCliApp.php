<?php

namespace ITV\cli;

class ItvCliApp {
    private $app_file = '';
    private $app_file_no_ext = '';
    private $app_name = '';
    private $app_data = [];
    private $app_data_filename = '';
    private $is_first_start = false;
    
    public function __construct($app_file) {
        $this->app_file = $app_file;
        
        $this->app_file_no_ext = preg_replace('/\.php$/', '', $this->app_file);
        $this->app_name = '';
        preg_match('/([^\/]+)$/', $this->app_file_no_ext, $matches);
        if(isset($matches[1])) {
            $this->app_name = $matches[1];
        }
        
        if(!$this->app_name) {
            die("Fail to detect app name!\n");
        }
        
        $this->app_data_filename = $this->app_file_no_ext . '.dat';
        $itv_is_first_start = true;
        
        if(file_exists($this->app_data_filename)) {
            $json = file_get_contents($this->app_data_filename);
            if($json) {
                $this->app_data = json_decode( $json, true );
            }
        }
        
        if(empty($this->app_data)) {
            $this->is_first_start = true;
        }
    }
    
    public function get_app_file() {
        return $this->app_file;
    }
    
    public function get_app_name() {
        return $this->app_name;
    }
    
    public function is_already_running() {
        $is_running = false;
    
        exec("ps u", $output, $result);
        $run_counter = 0;
    
        foreach ($output AS $line) {
            if(strpos($line, $this->app_name)) {
                $run_counter += 1;
            }
        }
    
        if($run_counter > 1) {
            $is_running = true;
        }
    
        return $is_running;
    }
    
    public function get_data($param_name) {
        return isset($this->app_data[$param_name]) ? $this->app_data[$param_name] : null;
    }
    
    public function save_data($param_name, $param_value) {
        $this->app_data[$param_name] = $param_value;
        file_put_contents($this->app_data_filename, json_encode( $this->app_data ));
    }
    
    public function delete_data_file() {
        return unlink($this->app_data_filename);
    }
}
