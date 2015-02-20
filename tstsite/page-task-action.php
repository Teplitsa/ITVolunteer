<?php
/**
 * Template Name: Task actions
 * 
 */

$new_task = true;
$task_data = array();
$task = new stdClass();
$faction = home_url('task-actions');


if( !is_user_logged_in() ) {
	$login_url = tst_get_login_url(home_url('/task-actions/'));
	wp_redirect($login_url);
	die();
}

if( !empty($_GET['task']) ){
	$new_task = false;
	
	// Read some ID to the editable task from URL, get a task post obj, fill an array with it's params.
	$_GET['task'] = (int)$_GET['task'];
	$task = get_post($_GET['task']);
	
	
	if(empty($task) || !current_user_can('edit_post', $task->ID)) {
		wp_redirect(home_url('/task-actions/'));
		die();
	}
	
	$faction = add_query_arg('task', $task->ID, $faction);
	if(function_exists('get_field')){ // check for ACF active
		$task_data = array(
			'task_id' => $task->ID,
			'task_title' => $task->post_title,
			'task_descr' => $task->post_content,
			'task_status' => $task->post_status,
			// 'field_533bebda0fe8d' - it's unreliable and bad practice use real meta_key instead
			'expecting' => get_field('field_533bebda0fe8d', $task->ID),
			'about_reward' => get_field('field_533bec930fe8e', $task->ID),
			'about_author_org' => get_field('field_533beee40fe8f', $task->ID),
			'deadline' => date_from_yymmdd_to_dd_mm_yy(get_field('field_533bef200fe90', $task->ID)),
			'reward_id' => get_field('field_533bef600fe91', $task->ID),
			'is_tst_consult_needed' => get_field(ITV_ACF_TASK_is_tst_consult_needed, $task->ID),
		);
	}
} else {
    $task_data = array(
        'task_status' => 'draft',
//        'expecting' => get_field('field_533bebda0fe8d', $task->ID),
//        'about_reward' => get_field('field_533bec930fe8e', $task->ID),
//        'about_author_org' => get_field('field_533beee40fe8f', $task->ID),
//        'deadline' => get_field('field_533bef200fe90', $task->ID),
//        'reward_id' => get_field('field_533bef600fe91', $task->ID),
    );
}

get_header();?>

<article class="task-actions">
<?php while ( have_posts() ) : the_post();?>


<form id="task-action" action="<?php echo $faction;?>" method="post" data-is-new-task="<?php echo (int)$new_task;?>">
<input type="hidden" id="task_id" value="<?php echo empty($task_data['task_id']) ? '' : $task_data['task_id'];?>" />
<?php wp_nonce_field('task_action');?>

<header class="page-heading">

	<div class="row">
		<div class="col-md-8">
			<?php echo frl_breadcrumbs();?>
		</div>
		<div class="col-md-4">
			<div class="status-block-task in-action">
				<div class="row-top task-meta">	
				<?php
					if($new_task)
						tst_newtask_fixed_meta();
					else
						tst_task_fixed_meta($task);
				?>
				</div>
			</div>
		</div>
	</div><!-- .row -->

	<div class="row">
		<div class="col-md-1">
        <?php if($new_task) {?>
			<span class="label label-default"><?php _e('Draft');?></span>
        <?php } else {
            $status_label = tst_get_task_status_label($task->post_status);
            switch($task->post_status) {
                case 'draft':
                    echo '<span class="label">'.$status_label.'</span>'; break;
                case 'publish':
                    echo '<span class="label alert-info">'.$status_label.'</span>'; break;
                case 'in_work':
                    echo '<span class="label alert-success">'.$status_label.'</span>'; break;
                case 'closed':
                    echo '<span class="label alert-warning">'.$status_label.'</span>'; break;
                default:
            }
        }?>
		</div>

		<div class="col-md-11">
			<div class="form-group">			
			    <input class="form-control input-lg" placeholder="<?php _e('Task title', 'tst');?>" type="text" id="task-title" value="<?php echo empty($task_data['task_title']) ? '' : $task_data['task_title'];?>" maxlength="90" />
                <div id="task-title-vm" class="validation-message" style="display: none;"></div>
			</div>
		</div>
	</div>
</header>

<div class="page-body">
<div class="row in-single">

	<div class="col-md-8">
        <?php if(isset($_GET['t'])) {

            switch((int)$_GET['t']) {
                case 1: $message = '<div class="alert alert-success">'.sprintf(__("Your task was successfully published! Now it's open for a new volunteers to do it. <a href='%s'>Check it out</a>", 'tst'), get_permalink($_GET['task'])).'</div>'; break;
                case 2: $message = '<div class="alert alert-success">'.sprintf(__('Your data was successfully saved. <a href="%s">Check it out</a>', 'tst'), get_permalink($_GET['task'])).'</div>'; break;
                    default: $message = '';
            }
            echo $message;
        }?>

		<div class="form-group">
			<label for="task-descr"><?php _e('Task description', 'tst');?></label>
			<small><a href="<?php echo site_url('/sovety-dlya-nko-uspeshnye-zadachi/') ?>" target="_blank">(<?php _e('Create task instructions', 'tst'); ?>)</a></small>
			<div class="itv-task-form-sublabel"><?php _e('itv_task_description_more_info', 'tst')?></div>
			<textarea id="task-descr" class="form-control" rows="6"><?php echo empty($task_data['task_descr']) ? '' : htmlspecialchars_decode($task_data['task_descr'], ENT_QUOTES);?></textarea>
            <div id="task-descr-vm" class="validation-message" style="display: none;"></div>
		</div>

		<div class="form-group">
			<label for="expecting"><?php _e('What we are expecting from you', 'tst');?></label>
			<div class="itv-task-form-sublabel"><?php _e('itv_task_expecting_more_info', 'tst')?></div>
			<textarea id="expecting" class="form-control" rows="6"><?php echo empty($task_data['expecting']) ? '' : strip_tags(htmlspecialchars_decode($task_data['expecting'], ENT_QUOTES));?></textarea>
            <div id="expecting-vm" class="validation-message" style="display: none;"></div>
		</div>

<!--		<div class="form-group">-->
<!--			<label for="about-reward">--><?php //_e('A couple of words about a reward for completing the task', 'tst');?><!--</label>-->
<!--			<textarea id="about-reward" class="form-control" rows="6">--><?php //echo empty($task_data['about_reward']) ? '' : strip_tags(htmlspecialchars_decode($task_data['about_reward'], ENT_QUOTES));?><!--</textarea>-->
<!--            <div id="about-reward-vm" class="validation-message" style="display: none;"></div>-->
<!--		</div>-->

		<div class="form-group">
			<label for="about-author-org"><?php _e("About task author's organization / project", 'tst');?></label>
			<div class="itv-task-form-sublabel"><?php _e('itv_task_about_author_org_more_info', 'tst')?></div>
			<textarea id="about-author-org" class="form-control" rows="6"><?php echo empty($task_data['about_author_org']) ? '' : strip_tags(htmlspecialchars_decode($task_data['about_author_org'], ENT_QUOTES));?></textarea>
            <div id="about-author-org-vm" class="validation-message" style="display: none;"></div>
		</div>

	</div><!-- .col-md-8 -->

	<div class="col-md-4">

		<div class="form-group">
			<label for="deadline"><?php _e('Deadline', 'tst');?></label>
			<input class="form-control" type="text" id="deadline" value="<?php echo empty($task_data['deadline']) ? '' : $task_data['deadline'];?>" />
			<input type="hidden" id="deadline-real" value="" />
            <div id="deadline-vm" class="validation-message" style="display: none;"></div>
		</div>
	
		<div class="form-group">
			<label for="reward"><?php _e('Reward', 'tst');?></label>
			<select id="reward" class="form-control">
				<option value=""><?php _e('Select a reward for a service, please', 'tst');?></option>
	
				<?php foreach(get_terms('reward', array('hide_empty' => false)) as $reward) {?>
					<option value="<?php echo $reward->term_id;?>" <?php selected($reward->term_id, @$task_data['reward_id']); ?>>
						<?php echo $reward->name;?>
					</option>
				<?php }?>
			</select>
            <div id="reward-vm" class="validation-message" style="display: none;"></div>
		</div>

        <div class="form-group">
            <label for="task-tags"><?php _e('Task tags', 'tst');?></label>
            <br />
            <select id="task-tags" multiple="10" data-placeholder="<?php _e('Choose a tags for the task...', 'tst');?>">
            <?php if( !$new_task ) {
                    $task_tags = wp_get_post_terms($task->ID, 'post_tag', array());
                    function tag_in_array($tag, $array) {
                        foreach($array as $value) {
                            if($tag->term_id == $value->term_id)
                                return true;
                        }
                        return false;
                    }
                }

                foreach(get_terms('post_tag', array('hide_empty' => false)) as $tag) {?>
                <option value="<?php echo $tag->name;?>" <?php echo (!$new_task && tag_in_array($tag, $task_tags)) ? 'selected="selected"' : '';?>><?php echo $tag->name;?></option>
            <?php }?>
            </select>
            <div id="task-tags-vm" class="validation-message" style="display: none;"></div>
        </div>
	
	<div class="form-group">
		<label for="task-descr"><?php _e('itv_task_consult_needed_label', 'tst')?></label>
		<div class="itv-task-form-sublabel">
			<input type="checkbox" name="is_tst_consult_needed" id="is_tst_consult_needed" class="itv-task-consult-needed" <?if($task_data['is_tst_consult_needed']):?>checked="checked"<?endif?>/>
			<?php _e('itv_task_consult_needed_more_info', 'tst')?>
		</div>			
	</div>
	

		<div class="form-group">
			<!-- we should have several types of buttons -->
            <?php
            if($new_task || $task->post_status == 'draft') {
                $publish_text = __('Publish', 'tst');
                $save_text = __('Save draft', 'tst');
                $new_status = 'publish';
            } else {
                $publish_text = __('Refresh', 'tst');
                $new_status = $task->post_status;
//                $save_text = 'Сохранить как черновик';
            }?>

			<input type="submit" class="task-submit btn btn-success btn-lg widefat" value="<?php echo $publish_text;?>" id="task-publish" name="task-publish" />
			<p class="help-block text-center button-status"><em><?php
                switch($task_data['task_status']) {
                    case 'publish': _e('The task is open for help offers', 'tst'); break;
                    case 'in_work': _e('The task is in work', 'tst'); break;
                    case 'closed': _e('The task is closed', 'tst'); break;
                    default: _e('The task is drafted', 'tst');
                }
            ?></em></p>
            <input type="hidden" id="status" value="<?php echo $new_status;?>" />
		</div>

		<div class="form-group">
			
			<?php if($new_task || $task->post_status == 'draft') :?>
				<div class="text-center">					
					<input type="submit" class="task-submit btn btn-default btn-sm" value="<?php echo $save_text;?>" id="task-draft" name="task-draft" />					
               </div>
				<hr>
			<?php endif; ?>
			 
			<div class="row">
				<div class="col-md-6">
				<?php if(!$new_task) : ?>
					<div class="pull-right widefat return-button">
						<a href="<?php echo get_permalink($task);?>" class="btn btn-default btn-sm widefat btn-grey"><?php _e('View Task', 'tst');?></a>
					</div>
				<?php endif;?>
				</div>
				
				<div class="col-md-6">
				<?php if($new_task) {?>
                    <!--<input type="submit" class="task-submit btn btn-default btn-sm widefat" value="<?php _e('Reset', 'tst');?>" id="task-cancel" name="task-cancel" onclick="history.back(); return false;" />-->&nbsp;
                <?php } else {?>
                    <input type="submit" class="task-submit btn btn-default btn-sm widefat btn-delete" value="<?php _e('Delete the task', 'tst');?>" id="task-delete" name="task-delete" />
                <?php }?>	
				</div>
				
			</div><!-- .row -->			
			
		</div><!-- .form-group -->
		
	</div><!-- .col-md-4 -->

</div><!-- .row -->
</div> <!-- .page-body -->

</form>

<div id="task-action-message"></div>

<?php endwhile; // end of the loop. ?>
</article>

<?php get_footer(); ?>