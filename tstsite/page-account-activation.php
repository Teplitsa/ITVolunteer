<?php
/**
 * Template Name: Account activation
 *
 **/

if(get_current_user_id() || empty($_GET['uid'])) {
    wp_redirect(home_url());
    exit();
}

$user = get_user_by('id', (int)$_GET['uid']);

if( !$user ) {

    wp_redirect("/account-activation-completed?status=error&message=" . urlencode(__('User account not found.', 'tst')));

} elseif(empty($_GET['code']) || get_user_meta($user->ID, 'activation_code', true) != $_GET['code']) {

    wp_redirect("/account-activation-completed?status=error&message=" . urlencode(__('Wrong data given.', 'tst')));

} else {
    update_user_meta($user->ID, 'activation_code', '');
    
    $tasks = itv_get_new_tasks_for_email(['all_time' => true]);
    $task_list = [];
    foreach ($tasks as $task) {
        $task_list[] = "<a href=\"" . get_permalink($task) . "\">{$task->post_title}</a><br /><br />";
    }

    ob_start();
    ItvAtvetka::instance()->mail('account_activated_notice', [
        'mailto' => $user->user_email,
        'login' => $user->user_login,
        'user_first_name' => $user->first_name,
        'open_tasks' => implode("\n", $task_list),
        'activation_url' => home_url('/login/'),
        'cta_url' => site_url('/tasks'),
    ]);
    ob_end_clean();

    wp_redirect("/account-activation-completed?status=ok");
}        

exit();