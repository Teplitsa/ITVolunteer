<?php
namespace ITV\models;

class MemberManager {
    public static $meta_role = 'itv_role';

    public static $ROLE_DOER = 'doer';
    public static $ROLE_AUTHOR = 'author';

    public function get_default_role() {
        return self::$ROLE_DOER;
    }

    public function validate_role($role) {
        return $role === self::$ROLE_DOER || $role === self::$ROLE_AUTHOR;
    }
}