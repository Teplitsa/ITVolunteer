<?php

include('cli_common.php');

$itv_site_stats = ItvSiteStats::instance();
$itv_site_stats->refresh_users_role_stats(200);
