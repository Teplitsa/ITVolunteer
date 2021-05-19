<?php

use \ITV\models\{TaskManager, RewardManager, RewardsV2Setup};

function itv_update_rewards_v2( $args = array(), $assoc_args = array() )
{
    $rewards_setup = new RewardsV2Setup();
    $rewards_setup->create_rewards();
    $rewards_setup->update_tasks_rewards();
    $rewards_setup->delete_useless_rewards();

    // Show success message.
    WP_CLI::success( 'Rewards updated' );
}

// Add the command.
if ( defined( 'WP_CLI' ) && WP_CLI ) {
    WP_CLI::add_command( 'itv-update-rewards-v2', 'itv_update_rewards_v2' );
}