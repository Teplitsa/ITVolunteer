<?php

class ItvIPGeo {
    private $_config;
    private static $_instance = null;
    private $_ipgeo = null;

    public function __construct() {
    }
    
    public static function instance() {
        if (ItvIPGeo::$_instance == NULL) {
            ItvIPGeo::$_instance = new ItvIPGeo ();
        }
        return ItvIPGeo::$_instance;
    }
    
    public function save_location_by_ip($user_id) {
        try {
            if(!$this->_ipgeo) {
                $this->_ipgeo = new IPGeoBase();
            }
            
            $city = $this->_ipgeo->getRecord(itv_get_client_ip());
            $city = $this->fix_region($city);
            
            if($city) {
                #update_user_meta($user_id, 'user_region', isset($city['region']) ? $city['region'] : '');
                update_user_meta($user_id, 'user_city', isset($city['city']) ? $city['city'] : '');
            }
        }
        catch (Exception $ex) {
        }
    }
    
    public function get_geo_region($user_id) {
        return get_user_meta($user_id, 'user_region', true);
    }
    
    public function get_geo_city($user_id) {
        return get_user_meta($user_id, 'user_city', true);
    }
    
    public function get_regions() {
        if(!$this->_ipgeo) {
            $this->_ipgeo = new IPGeoBase();
        }
        # implement to add edit region functionality
    }
    
    private function fix_region($city) {
        if($city['region'] == 'Крым') {
            $city['region'] = 'Республика Крым';
        }
        return $city;
    }
}        

?>
