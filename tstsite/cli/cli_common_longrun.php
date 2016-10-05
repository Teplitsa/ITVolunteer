<?php

include('cli_common.php');

if($ITV_CLI_APP->is_already_running()) {
    die($ITV_CLI_APP->get_app_name() . " already running!\n");
}
