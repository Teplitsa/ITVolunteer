<?php
namespace ITV\dao;

use \ITV\dao\ITVDAO;

class UserXP extends ITVDAO {
    protected $primaryKey = 'user_id';
    protected $table = 'str_itv_user_xp';
}

class UserXPActivity extends ITVDAO {
    protected $table = 'str_itv_user_activity';
}

class UserXPAlerts extends ITVDAO {
    protected $primaryKey = 'user_id';
    protected $table = 'str_itv_user_xp_alerts';
}
