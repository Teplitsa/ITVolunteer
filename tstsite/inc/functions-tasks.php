<?php
/**
 * Task related utilities and manipulations
 * (code wiil be modevd here from customizer.php and extras.php)
 **/

/** Tasks custom status **/
add_action('init', 'tst_custom_task_status');
function tst_custom_task_status(){
    /**
     * Предполагаем, что:
     * draft - черновик задачи,
     * publish - задача открыта,
     * in_work - задача в работе,
     * closed - закрыта.
     */

    register_post_status('in_work', array(
        'label'                     => __('In work', 'tst'),
        'public'                    => true,
        'exclude_from_search'       => false,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop('In work <span class="count">(%s)</span>', 'In work <span class="count">(%s)</span>'),
    ));
    register_post_status('closed', array(
        'label'                     => __('Closed', 'tst'),
        'public'                    => true,
        'exclude_from_search'       => true,
        'show_in_admin_all_list'    => true,
        'show_in_admin_status_list' => true,
        'label_count'               => _n_noop('Closed <span class="count">(%s)</span>', 'Closed <span class="count">(%s)</span>'),
    ));
}

