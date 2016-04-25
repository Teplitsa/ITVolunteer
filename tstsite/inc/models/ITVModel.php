<?php
namespace ITV\models;

class ITVModel {
    
}

abstract class ITVSingletonModel {
    private static $_instance = null;
    
    public static function instance() {
        if(static::$_instance === null) {
            static::$_instance = new static();
        }
        return static::$_instance;
    }
}
