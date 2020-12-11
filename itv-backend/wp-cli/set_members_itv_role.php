<?php

use \ITV\models\MemberManager;
use \ITV\models\MemberTasks;
use \ITV\models\TaskManager;

function itv_set_members_itv_role( $args = array(), $assoc_args = array() ) {

    list( $user_id ) = $args;

    $arguments = wp_parse_args(
        $assoc_args,
        array(
        )
    );

    $portion = 10;
    $params = [
        'number' => $portion,
        'offset' => 0,
        'orderby' => 'ID', 
        'order' => 'ASC',
    ];

    if(!empty($user_id)) {
        $params['include'] = $user_id;
    }

    $members = new MemberManager();
    $tasks = new TaskManager();

    while(true) {

        $uquery = new WP_User_Query($params);
        $users = $uquery->get_results();

        if(!empty($users)) {

            foreach( $users as $user ) {
                $member_tasks = new MemberTasks($user->ID);

                echo $user->ID . " - " . $user->user_nicename . "\n";

                $exist_itv_role = $members->get_member_itv_role($user->ID);
                if(!$exist_itv_role) {
                    $itv_role = $member_tasks->calc_member_role_by_tasks($user->ID);
                    echo "set role: " . $itv_role . "\n";
                    $members->set_member_itv_role($user->ID, $itv_role);
                }
                else {
                    echo "exist role: " . $exist_itv_role . "\n";
                }
            }

            $params['offset'] += $portion;
        }
        else {

            break;
        }
    }

    // Show success message.
    WP_CLI::success( 'Itv role set for all users.' );
}

// Add the command.
if ( defined( 'WP_CLI' ) && WP_CLI ) {
    WP_CLI::add_command( 'itv-set-members-itv-role', 'itv_set_members_itv_role' );
}