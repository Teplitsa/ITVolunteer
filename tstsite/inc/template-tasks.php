<?php
/**
 * Template tags for tasks templates
 * moved here after adoption in redesign
 **/

/** == Tasks in loop ==**/
function tst_get_task_status_label($status = false) {

    if( !$status ) {
        global $post;

        if( !$post || $post->post_type != 'tasks')
            return false;

        $status = $post->post_status;
    }

    $status_list = tst_get_task_status_list();
    return isset($status_list[$status]) ? $status_list[$status] : false;
}


function tst_task_fixed_meta_in_card($task = null){
	global $post;
	
	if( !$task )
		$task = $post;
    
    $user_workplace = trim(sanitize_text_field(tst_get_member_field('user_workplace', $author)));
   
	$meta = array();
	$meta[] = tst_get_task_author_link($task);
	
	if(!empty($user_workplace)) {
		$meta[] = "<span class='workplace'>{$user_workplace}</span>";
	}
	
	$meta[] = "<time>".get_the_date('', $task)."</time>";
	
	return implode(', ', $meta);
}


function tst_get_task_author_link($task = null){
	global $post;
	
	if(!$task)
		$task = $post;
		
	$author = get_user_by('id', $task->post_author);
	if( !$author )
		return '';

	$name = tst_get_member_name($author);
	$url = tst_get_member_url($author);
	
	return "<a href='{$url}'>{$name}</a>";
}


function tst_task_reward_in_card(){
	$reward = get_term(get_field('field_533bef600fe91', get_the_ID()), 'reward'); //
?>
	<span class="reward-label" <?if(!is_wp_error($reward)):?>title="Награда"<?endif?>>
		<span class="reward-icon glyphicon glyphicon-star"></span>
		<span class="reward-name"><?php
			echo is_wp_error($reward) ? __('No reward setted yet', 'tst') : $reward->name;
		?>
		</span>
	</span>
<?php
}