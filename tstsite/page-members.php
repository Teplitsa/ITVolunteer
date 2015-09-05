<?php
/**
 * Template Name: MembersPage
 **/

global $wp_query;


if(is_single_member()) {
	
	$tst_member = tst_get_current_member();	
    if( !$tst_member->ID ) {
        $refer = stristr(wp_get_referer(), $_SERVER['REQUEST_URI']) !== false ? home_url() : wp_get_referer();
        $back_url = $refer ? $refer : home_url();

        wp_redirect($back_url);
        exit;
    }
}

get_header();

if(is_single_member()) {	
	get_template_part('partials/content', 'member_single');
	
} else { ?>
<header class="page-heading members-list-header no-breadcrumbs">
	<div class="row">
	
		<div class="col-md-3">
			<h1 class="page-title"><?php echo frl_page_title();?></h1>
		</div>
		<div class="col-md-9">
			<?php tst_members_filters_menu();?>
		</div>
		
		
	</div><!-- .row -->

</header>

<div class="page-body">

<?php

	$per_page = get_option('posts_per_page');
	
	if(isset($wp_query->query_vars['navpage']) && $wp_query->query_vars['navpage']) {
		$current = ($wp_query->query_vars['navpage'] > 1) ? $wp_query->query_vars['navpage'] : 1;
	}
	else {
		$current = ($wp_query->query_vars['paged'] > 1) ? $wp_query->query_vars['paged'] : 1;
	}
	
	$offset = ($current > 1) ? ($current-1)*$per_page : 0;

	$users_query_params = array(
		'number' => $per_page,
		'offset' => $offset,
		'exclude' => ACCOUNT_DELETED_ID,
		'query_id' => 'get_members_for_members_page',
		'fields' => 'all_with_meta' 
	);
	
	if(isset($wp_query->query_vars['member_role']) && $wp_query->query_vars['member_role']) {			
		$users_query_params['meta_query'] = array(
			array(
				'key'     => 'tst_member_role',
				'value'   => $wp_query->query_vars['member_role'],
				'compare' => '='
			)
		);
		
		//orderby
		if($wp_query->query_vars['member_role'] == 'hero'){
			$users_query_params['orderby'] = array('meta_value_num' => 'DESC', 'registered' => 'DESC');
			$users_query_params['meta_key'] = 'tst_member_tasks_solved';
		}
		elseif($wp_query->query_vars['member_role'] == 'volunteer') {
			$users_query_params['orderby'] = array('meta_value_num' => 'DESC', 'registered' => 'DESC');
			$users_query_params['meta_key'] = 'tst_member_tasks_joined';
		}
		elseif($wp_query->query_vars['member_role'] == 'donee') {
			$users_query_params['orderby'] = array('meta_value_num' => 'DESC', 'registered' => 'DESC');
			$users_query_params['meta_key'] = 'tst_member_tasks_created_closed';
		}
		elseif($wp_query->query_vars['member_role'] == 'activist') {
			$users_query_params['orderby'] = array('meta_value_num' => 'DESC', 'registered' => 'DESC');
			$users_query_params['meta_key'] = 'tst_member_tasks_created';
		}
	}
	else { //general ordrby	
		$users_query_params['orderby'] = array('meta_value_num' => 'DESC', 'registered' => 'DESC');
		$users_query_params['meta_key'] = 'tst_member_tasks_solved';
	}
	
	
	$user_query = new WP_User_Query($users_query_params);
	$u_ids = ITV_Query::get_user_id_from_users($users);
	update_meta_cache('user', $ids); //meta cache
	
	if($user_query->results) {
?>
	
	<div class="row in-loop members-list">
	<?php
		foreach($user_query->results as $u){
			$tst_member = $u;
			
			include(get_template_directory().'/partials/content-member.php');
		}
	?>
	</div><!-- .row -->
	
	<nav class="clearfix nav-paging" id="nav-below" role="navigation"><div class="pull-right">
		<?php tst_members_paging($wp_query, $user_query, $echo = true); ?>
	</div></nav>       

	<?php } else {?>

		<?php get_template_part( 'no-results', 'index' ); ?>

	<?php }?>

</div><!-- .page-body -->

<?php } //if single member ?>
<?php get_footer(); ?>
