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
	$login_url = tst_get_login_url($faction);
	wp_redirect($login_url);
	exit;
}

if( !empty($_GET['task']) ){
	$new_task = false;
	
	// Read some ID to the editable task from URL, get a task post obj, fill an array with it's params.
	$_GET['task'] = (int)$_GET['task'];
	$task = get_post($_GET['task']);
	
	
	if(empty($task) || !current_user_can('edit_post', $task->ID)) {
		wp_redirect($faction);
		exit;
	}
	
	$faction = add_query_arg('task', $task->ID, $faction);
	if(function_exists('get_field')){ // check for ACF active
		$task_data = array(
			'task_id' => $task->ID,
			'task_date' => $task->post_date,
			'task_title' => $task->post_title,
			'task_descr' => $task->post_content,
			'task_status' => $task->post_status,				
			'about_author_org' => get_field('about-author-org', $task->ID),  			
			'reward_id' => get_field('reward', $task->ID),
			'is_tst_consult_needed' => get_field('is_tst_consult_needed', $task->ID),
		); 
	}
	$reward = get_the_terms($task->ID, 'reward'); 
	$task_data['reward'] = $reward ? $reward[0] : null;
} else {
    $task_data = array(
        'task_status' => 'draft',
    );
}

$member_id = ($new_task) ? get_current_user_id() : $task->post_author;
get_header();?>

<article class="task-actions tpl-edit-task">
<?php while ( have_posts() ) : the_post();?>


<form id="task-action" action="<?php echo $faction;?>" method="post" data-is-new-task="<?php echo (int)$new_task;?>">
<input type="hidden" id="task_id" value="<?php echo empty($task_data['task_id']) ? '' : $task_data['task_id'];?>" />
<?php wp_nonce_field('task_action');?>

<header class="page-heading">

	<div class="row">		
		<div class="col-md-8">
			<div class="form-group">			
			    <input class="form-control input-lg" placeholder="<?php _e('Short task description (140 char.)', 'tst');?>" type="text" id="task-title" value="<?php echo empty($task_data['task_title']) ? '' : $task_data['task_title'];?>" maxlength="90" />
                <div id="task-title-vm" class="validation-message" style="display: none;"></div>
			</div>
		</div>
		
		<div class="col-md-4">
		<?php $date = ($new_task) ? strtotime(sprintf('now %s hours', get_option('gmt_offset'))) : strtotime($task_data['task_date']); ?>
			<time><?php echo date('d.m.y.', $date);?></time><br>
		<?php
			$status  = ($new_task) ? 'draft' : get_post_status($task);			
			$status_label = tst_get_task_status_label($status);
		?>
			<span class="status-label label-<?php echo $status;?>"><?php echo $status_label;?></span>		
		</div>
	</div>	
</header>

<div class="page-body">
<div class="row in-single">

	<div class="col-md-8">
        <?php if(isset($_GET['t'])) {

            switch((int)$_GET['t']) {
                case 1: $message = '<div class="alert alert-success">'.sprintf(__("Information about your task was published! Now it's open for a new volunteers to do it. <a href='%s'>Check it out</a>", 'tst'), get_permalink($_GET['task'])).'</div>'; break;
                case 2: $message = '<div class="alert alert-success">'.sprintf(__('Your data was successfully saved. <a href="%s">Check it out</a>', 'tst'), get_permalink($_GET['task'])).'</div>'; break;
                    default: $message = '';
            }
            echo $message;
        }?>

		<div class="form-group">
			<label for="task-descr"><?php _e('Task description', 'tst');?> <small><a href="<?php echo site_url('/sovety-dlya-nko-uspeshnye-zadachi/') ?>" target="_blank">(<?php _e('Create task instructions', 'tst'); ?>)</a></small></label>
			
			<textarea id="task-descr" class="form-control" rows="6" placeholder="<?php _e('itv_task_description_more_info', 'tst')?>"><?php echo empty($task_data['task_descr']) ? '' : htmlspecialchars_decode($task_data['task_descr'], ENT_QUOTES);?></textarea>
            <div id="task-descr-vm" class="validation-message" style="display: none;"></div>
		</div>

		<div class="form-group">
			<label for="about-author-org"><?php _e("About task author's organization / project", 'tst');?></label>
		<?php			
			if($new_task){
				$about = apply_filters('frl_the_title', tst_get_member_field('user_workplace_desc', $member_id));
			}
			else {
				$about = empty($task_data['about_author_org']) ? '' : strip_tags(htmlspecialchars_decode($task_data['about_author_org'], ENT_QUOTES));
			}			
		?>
			<textarea id="about-author-org" class="form-control" rows="6" placeholder="<?php _e('itv_task_about_author_org_more_info', 'tst')?>"><?php echo $about;?></textarea>
            <div id="about-author-org-vm" class="validation-message" style="display: none;"></div>
		</div>
		
		<div class="form-group author-ref">		
			<span class="author-label"><?php _e('Task\'s author', 'tst');?></span> <a href="<?php echo tst_get_member_url((int)$member_id);?>"><?php echo tst_get_member_name((int)$member_id);?></a>
		</div>
	</div><!-- .col-md-8 -->

	
	<div class="col-md-4">

		<div class="form-group">
            <label for="task-tags"><?php _e('Task tags', 'tst');?></label>
            <br />
            <select id="task-tags" multiple="10" data-placeholder="<?php _e('Choose a tags for the task...', 'tst');?>">
            <?php if( !$new_task ) {
                    $task_tags = wp_get_post_terms($task->ID, 'post_tag', array());
                    function tag_in_array(stdClass $tag, $array) {
                        foreach($array as $value) {
                            if($tag->term_id == $value->term_id)
                                return true;
                        }
                        return false;
                    }
                }
				$tags = get_terms('post_tag', array('hide_empty' => false, 'orderby' => 'count', 'order' => 'DESC'));
                foreach($tags as $tag) { ?>
                <option value="<?php echo esc_attr($tag->name);?>" <?php echo (!$new_task && tag_in_array($tag, $task_tags)) ? 'selected="selected"' : '';?>><?php echo apply_filters('frl_the_title', $tag->name);?></option>
            <?php }?>
            </select>
            <div id="task-tags-vm" class="validation-message" style="display: none;"></div>
        </div>
	
		<div class="form-group">
			<label for="reward"><?php _e('Reward', 'tst');?></label>
			<select id="reward" class="form-control">
				<option value=""><?php _e('Select a reward for a service, please', 'tst');?></option>
				<?php
					$terms = get_terms('reward', array('hide_empty' => false));
					$default_reward = get_term_by('slug', 'link', 'reward');
					$selected = (isset($task_data['reward'])) ? $task_data['reward']->term_id : $default_reward->term_id;
					foreach($terms as $reward) {
				?>
					<option value="<?php echo (int)$reward->term_id;?>" <?php selected($reward->term_id, $selected); ?>>
						<?php echo apply_filters('frl_the_title', $reward->name);?>
					</option>
				<?php }?>
			</select>
            <div id="reward-vm" class="validation-message" style="display: none;"></div>
		</div>
       
	
		<div class="form-group checkbox">
			<b><?php _e('itv_task_consult_needed_label', 'tst')?></b>
			<label for="is_tst_consult_needed" class="itv-task-form-sublabel">
				<input type="checkbox" name="is_tst_consult_needed" id="is_tst_consult_needed" class="itv-task-consult-needed" <?php if(isset($task_data['is_tst_consult_needed']) && $task_data['is_tst_consult_needed']):?>checked="checked"<?php endif; ?>/>
				<?php _e('itv_task_consult_needed_more_info', 'tst')?>
			</label>			
		</div>
	

		<div class="form-group publish-button">
			<!-- we should have several types of buttons -->
            <?php
            if($new_task || $task->post_status == 'draft') {
                $publish_text = __('Publish', 'tst');
                $save_text = __('Save draft', 'tst');
                $new_status = 'publish';
            } else {
                $publish_text = __('Refresh', 'tst');
                $new_status = $task->post_status;
            }?>

			<input type="submit" class="task-submit btn btn-success btn-lg widefat" value="<?php echo $publish_text;?>" id="task-publish" name="task-publish" />			
            <input type="hidden" id="status" value="<?php echo $new_status;?>" />
		</div>

		<div class="form-group">
			
			<?php if($new_task || $task->post_status == 'draft') :?>
				<div class="row task-buttons">				
					<div class="col-md-6"><input type="submit" class="task-submit widefat btn btn-default btn-sm" value="<?php echo $save_text;?>" id="task-draft" name="task-draft" />	</div>			
               </div>
				
			<?php endif; ?>
			 
			<div class="row task-buttons">
				<div class="col-md-6">
				<?php if(!$new_task) : ?>					
					<a href="<?php echo get_permalink($task);?>" class="btn btn-default btn-sm widefat btn-grey"><?php _e('View Task', 'tst');?></a>					
				<?php endif;?>
				</div>
				<?php if(!$new_task) { ?> 
				<div class="col-md-6">				
                    <input type="submit" class="task-submit btn btn-default btn-sm widefat btn-delete" value="<?php _e('Delete the task', 'tst');?>" id="task-delete" name="task-delete" />                	
				</div>
				<?php }?>
				
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
