<?php
namespace ITV\models;

class ITVModel {
    
}

abstract class ITVSingletonModel {
    protected static $_instance = null;
    
    public static function instance() {
        if(self::$_instance === null) {
            self::$_instance = new static();
        }
        return self::$_instance;
    }
}
