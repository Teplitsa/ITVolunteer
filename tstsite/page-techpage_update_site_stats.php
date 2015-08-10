<br />
***********************************
<br /><br />

<?php

$itv_site_stats = ItvSiteStats::instance();
$itv_site_stats->refresh_users_role_stats();

echo "BENEFICIARY=" . $itv_site_stats->get_stats_value(ItvSiteStats::$USERS_ROLE_BENEFICIARY) . "<br />";
echo "SUPERHERO=" . $itv_site_stats->get_stats_value(ItvSiteStats::$USERS_ROLE_SUPERHERO) . "<br />";
echo "ACTIVIST=" . $itv_site_stats->get_stats_value(ItvSiteStats::$USERS_ROLE_ACTIVIST) . "<br />";
echo "VOLUNTEER=" . $itv_site_stats->get_stats_value(ItvSiteStats::$USERS_ROLE_VOLUNTEER) . "<br />";
echo "TOTAL=" . $itv_site_stats->get_stats_value(ItvSiteStats::$USERS_TOTAL) . "<br />";

?>
<br />
***********************************
<br /><br /><br /><br /><br /><br />
