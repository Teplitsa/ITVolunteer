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

class UserXPActivityCandidate extends ITVDAO {
    public $timestamps = false;
    protected $table = 'str_itv_user_activity_candidate';
}

class UserXPAlerts extends ITVDAO {
    protected $primaryKey = 'user_id';
    protected $table = 'str_itv_user_xp_alerts';
}

class UserXPExtra extends ITVDAO {
    public $timestamps = false;
    protected $primaryKey = 'user_id';
    protected $table = 'str_itv_user_xp_extra';
}
