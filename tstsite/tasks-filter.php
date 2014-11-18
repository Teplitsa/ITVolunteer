<div class="tasks-filters-frame">
	
<div id="tasks-filters-trigger" class="pull-right">
	<span class="txt"><?php _e('Select a tasks', 'tst');?></span>
	<div class="pull-right icon"><span class="glyphicon glyphicon-collapse-down"></span></div>
</div>

<div id="tasks-filters" <?php echo empty($_GET) ? 'style="display: none;"' : '';?>>
	<form id="tasks-filters-form" method="get" action="" class="form-horizontal">
		<div class="form-group">
			<label for="filter-task-status" class="col-sm-3 control-label"><?php _e('Status', 'tst');?></label>
			<div class="col-sm-9">
				<select name="st" id="filter-task-status" class="form-control">
                    <option value="-" <?php echo isset($_GET['st']) && $_GET['st'] == '-' ? 'selected="selected"' : '';?>><?php _e('Any status', 'tst');?></option>
				<?php foreach(tst_get_task_status_list() as $status => $label) {
					if($status == 'draft')
						continue;?>
					<option value="<?php echo $status;?>" <?php echo isset($_GET['st']) && $_GET['st'] == $status ? 'selected="selected"' : '';?>><?php echo $label;?></option>
				<?php }?>
				</select>
			</div> 
		</div><!-- .form-control -->
		
		<div class="form-group">
			<label for="filter-task-deadline" class="col-sm-3 control-label"><?php _e('Deadline', 'tst');?></label>
			<div class="col-sm-9">
			<select name="dl" id="filter-task-deadline" class="form-control">
				<option value="" <?php echo isset($_GET['dl']) && $_GET['dl'] == '' ? 'selected="selected"' : '';?>><?php _e('Any date', 'tst');?></option>
				<option value="10" <?php echo isset($_GET['dl']) && $_GET['dl'] == '10' ? 'selected="selected"' : '';?>><?php _e('Less than 10 days');?></option>
				<option value="lm" <?php echo isset($_GET['dl']) && $_GET['dl'] == 'lm' ? 'selected="selected"' : '';?>><?php _e('Less than a month', 'tst');?></option>
				<option value="mm" <?php echo isset($_GET['dl']) && $_GET['dl'] == 'mm' ? 'selected="selected"' : '';?>><?php _e('More than a month', 'tst');?></option>
			</select>
			<!--  <input type="hidden" name="deadline-real" id="deadline-real" value="" />-->
			</div>
		</div>
		
		<div class="form-group">
			<label for="reward" class="col-sm-3 control-label"><?php _e('Reward', 'tst');?></label>
			<div class="col-sm-9">
			<select name="rw" id="reward" class="form-control">
				<option value=""><?php _e('Select a reward for a service, please', 'tst');?></option>

				<?php foreach(get_terms('reward', array('hide_empty' => false)) as $reward) {?>
					<option value="<?php echo $reward->term_id;?>" <?php if( !empty($_GET['rw']) ) selected($reward->term_id, $_GET['rw']);?> >
						<?php echo $reward->name;?>
					</option>
				<?php }?>
			</select>
			</div>
		</div>
		
		<div class="form-group">
			<label for="task-tags" class="col-sm-3 control-label"><?php _e('Task tags', 'tst');?></label>
			<div class="col-sm-9">
			<select name="tt[]" id="task-tags" multiple="10" data-placeholder="<?php _e('Choose a tags for the task', 'tst');?>">
				<?php $tags_selected = isset($_GET['tt']) ? (array)$_GET['tt'] : array();

				foreach(get_terms('post_tag', array('hide_empty' => false)) as $tag) {?>
					<option value="<?php echo $tag->slug;?>" <?php echo in_array($tag->slug, $tags_selected) ? 'selected="selected"' : '';?>><?php echo $tag->name;?></option>
				<?php }?>
			</select>
			</div>
		</div>
		
		<div class="form-group">
			<div class="col-sm-offset-3 col-sm-9">
				<input type="submit" class="task-filter-submit btn btn-success btn-sm" value="<?php _e('Filter tasks', 'tst');?>" id="task-filter" />
			</div>
		</div>
	</form>
</div>


</div> <!-- .tasks-filters-frame -->