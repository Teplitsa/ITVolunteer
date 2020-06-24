<?php
namespace ITV\dao;

use \WeDevs\ORM\Eloquent\Model as Model;

class ITVDAO extends Model {
    protected $prefix = 'str_';
}

class UserNotif extends ITVDAO {
//     public $timestamps = true;
    protected $table = 'str_itv_user_notif';
}
