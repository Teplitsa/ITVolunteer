<?php
?>

<div id="comments" class="comments-area">

<?php if ( have_comments() ) : ?>

	
<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
<nav id="comment-nav-above" class="comment-navigation" role="navigation">
	<h5 class="screen-reader-text"><?php _e( 'Comment navigation', 'tst' ); ?></h5>
	<ul class="pager">
		<li class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'tst' ) ); ?></li>
		<li class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'tst' ) ); ?></li>
	</ul>
</nav>
<?php endif; ?>

<ol class="comment-list media-list">
	<?php wp_list_comments( array( 'callback' => 'tst_comment', 'avatar_size' => 50 ) );?>
</ol>

<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
<nav id="comment-nav-below" class="comment-navigation" role="navigation">
	<h1 class="screen-reader-text"><?php _e( 'Comment navigation', 'tst' ); ?></h1>
	<div class="nav-previous"><?php previous_comments_link( __( '&larr; Older Comments', 'tst' ) ); ?></div>
	<div class="nav-next"><?php next_comments_link( __( 'Newer Comments &rarr;', 'tst' ) ); ?></div>
</nav>
<?php endif; ?>

<?php endif; // have_comments() ?>

<?php
	// If comments are closed and there are comments, let's leave a little note, shall we?
	if ('0' == get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
?>
	<div class="no-comments well well-sm"><?php _e( 'There is no comments.', 'tst' ); ?></div>
<?php endif; ?>

<?php comment_form($args = array(
		'id_form'           => 'commentform',  // that's the wordpress default value! delete it or edit it ;)
		'id_submit'         => 'commentsubmit',
		'logged_in_as'      => '',
		'must_log_in'       => '',
		'title_reply'       => __( 'Leave a comment', 'tst' ),  // that's the wordpress default value! delete it or edit it ;)
//	    'title_reply_to'    => __( 'Leave a Reply to %s' ),  // that's the wordpress default value! delete it or edit it ;)
//	    'cancel_reply_link' => __( 'Cancel Reply' ),  // that's the wordpress default value! delete it or edit it ;)
//	    'label_submit'      => __( 'Post Comment' ),  // that's the wordpress default value! delete it or edit it ;)

		'comment_field' =>  '<p><textarea id="comment" class="form-control" name="comment" cols="45" rows="8" aria-required="true"></textarea></p>',
		'comment_notes_after' => ''
		
		
));

?>

</div><!-- #comments -->
