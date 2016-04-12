<?php
/**
 * Template Name: Member tasks
 *
 **/


$user_login = get_query_var('membername');
$member = get_user_by('slug', $user_login);

if( !$member ) {
	$refer = stristr(wp_get_referer(), $_SERVER['REQUEST_URI']) !== false ? home_url() : wp_get_referer();
	$back_url = $refer ? $refer : home_url();

	wp_redirect($back_url);
	exit;
}

$member_id = $member->ID;
$member_data = array(
		'member_id' =>  $member_id,
		'user_login' => $member->user_login,
		'user_email' => $member->user_email,
		'first_name' => $member->first_name,
		'last_name' => $member->last_name,
);

$current_page_slug = get_post_field( 'post_name', get_post() );

get_header();?>

<article class="member-actions">

<header class="page-heading">

	<div class="row">
		<div class="col-md-8">
			<nav class="page-breadcrumbs"><?php echo frl_breadcrumbs();?></nav>
			<h1 class="page-title">
				<?php echo frl_page_title();?>
				<small class="edit-item"><a href="<?php echo tst_get_member_url($member);?>"><?php _e('Back to profile', 'tst');?></a></small>
			</h1>			
		</div>
		
		<div class="col-md-4">
            <div class="status-block-member">
                <?php tst_member_profile_infoblock($member->ID);?>
            </div>
		</div>
	</div><!-- .row -->
	
</header>
	
<div class="page-body">
    <div class="in-single">
    
	<div class="row">
        <div id="task-tabs" class="itv-reviews-tabs">
            <ul class="nav nav-tabs">
            <?php if($current_page_slug == 'author-reviews'): ?>
                <li class="active"><a href="#doer-reviews-list" data-toggle="tab"><?php _e('Author reviews', 'tst');?></a></li>
            <?php else: ?>
                <li class="active"><a href="#doer-reviews-list" data-toggle="tab"><?php _e('Doer reviews', 'tst');?></a></li>
            <?php endif ?>
            </ul>
	<?php
		$current_page = get_query_var( 'paged', 1 );
		if(!$current_page) {
			$current_page = 1;
		}
		$per_page = get_option('posts_per_page');
		$offset = ($current_page - 1) * $per_page;
		if($current_page_slug == 'author-reviews') {
			$latest_doer_reviews = ItvReviewsAuthor::instance()->get_author_reviews($member->ID, $offset, $per_page); 
		}
		else {
			$latest_doer_reviews = ItvReviews::instance()->get_doer_reviews($member->ID, $offset, $per_page);
		}
	?>
	<?php if(count($latest_doer_reviews) > 0):?>
            <div class="tab-content">
                <div class="tab-pane fade in active itv-user-reviews-list" id="doer-reviews-list">
                <?php
                foreach($latest_doer_reviews as $review) {
                    if($current_page_slug == 'author-reviews') {
                        $review_author = get_user_by('id', $review->doer_id);
                    }
                    else {
                        $review_author = get_user_by('id', $review->author_id);
                    }
                    itv_show_review($review, $review_author);
                }
                ?>
                </div>
                <?php 
                
                $filter_args = array();
                if(isset($_GET) && is_array($_GET)) {
                	foreach($_GET as $k => $v) {
                		$filter_args[$k] = $v;
                	}
                }
                
                $parts = parse_url(get_pagenum_link(1));
                $base = trailingslashit(esc_url($parts['host'].$parts['path']));
                if(function_exists('tstmu_is_ssl') && tstmu_is_ssl()){
                	$base = str_replace('http:', 'https:', $base);
                }
                
		if($current_page_slug == 'author-reviews') {
	                $total_pages = ceil(ItvReviewsAuthor::instance()->count_reviews_for_author($member->ID) / $per_page);
		}
		else {
			$total_pages = ceil(ItvReviews::instance()->count_reviews_for_doer($member->ID) / $per_page);
		}	
                
				$pagination = array(
			        'base' => $base.'%_%',
			        'format' => 'page/%#%/',
			        'total' => $total_pages,
			        'current' => $current_page,
					'prev_text' => __('&laquo; prev.', 'tst'),
			        'next_text' => __('next. &raquo;', 'tst'),
			        'end_size' => 4,
			        'mid_size' => 4,
			        'show_all' => false,
			        'type' => 'list', //list
					'add_args' => $filter_args
			    );
				
				$links = paginate_links($pagination);
				if(!empty($links)){		
				    $links = str_replace("<ul class='page-numbers'>", '<ul class="page-numbers pagination">', $links);
				}
				echo $links;
	
	                ?>
			</div>
	<?php else: ?>
		<br />
		<div class="alert alert-danger"><?php _e('Members has no any reviews yet', 'tst');?></div>
	<?php endif?>
	
		</div>			
	</div>
	
    </div><!-- .row -->
</div> <!-- .page-body -->

</article>

<?php get_footer();?>
