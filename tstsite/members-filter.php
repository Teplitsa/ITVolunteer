<div class="members-filters-frame">
	
<div id="members-filters-trigger" class="pull-right">
	<span class="txt"><?php _e('Select members', 'tst');?></span>
	<div class="pull-right icon"><span class="glyphicon glyphicon-collapse-down"></span></div>
</div>

<div id="members-filters" style="display: none;">
	<form id="members-filters-form" method="get" action="<?php echo site_url('/members/')?>" class="form-horizontal">
		<div class="form-group">
			<label for="filter-member-status" class="col-sm-3 control-label"><?php _e('Member role', 'tst');?></label>
			<div class="col-sm-9">
				<select name="role" id="filter-member-status" class="form-control">
					<option value="-" <?php echo isset($_GET['role']) && $_GET['role'] == '-' ? 'selected="selected"' : '';?>><?php _e('Any role', 'tst');?></option>
				<?php foreach(array(1, 2, 3) as $role): ?>
					<option value="<?php echo $role;?>" <?php echo isset($_GET['role']) && $_GET['role'] == $role ? 'selected="selected"' : '';?>><?php echo tst_get_member_role_label($role);?></option>
				<?php endforeach ?>
				</select>
			</div> 
		</div><!-- .form-control -->
		
		<div class="form-group">
			<div class="col-sm-offset-3 col-sm-9">
				<input type="submit" class="member-filter-submit btn btn-success btn-sm" value="<?php _e('Filter members', 'tst');?>" id="member-filter" />
			</div>
		</div>
	</form>
</div>


</div> <!-- .members-filters-frame -->