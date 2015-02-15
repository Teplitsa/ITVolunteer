<?php
/* news on homepage **/

$args = array(
	'posts_per_page'   => 1,
	'orderby'          => 'post_date',
	'order'            => 'DESC',
	'post_type'        => 'post',
	'post_status'      => 'publish',
	'suppress_filters' => true 
);

$news_posts = get_posts( $args );
$news_post = null;
if(count($news_posts)) {
	$news_post = $news_posts[0];
}
?>

<?php
if($news_post):
?>
<article <?php post_class('col-md-6 home-news item-masonry'); ?>>
<div class="border-card">
	<h2>Новости проекта</h2>
	
	<h4>				
		<a href="<?php echo post_permalink($news_post->ID); ?>" rel="bookmark"><?php echo get_the_title($news_post->ID); ?></a>
	</h4>	
	
	<div class="home-news-content">
		<?$thumbnail = get_the_post_thumbnail($news_post->ID, 'large')?>
		<?php if ( $thumbnail ): ?>
			<a href="<?php echo get_permalink($news_post->ID);?>" class="thumb-link"><?php echo $thumbnail ?></a>
		<?php endif?>
		<?php global $post; $prev_post = $post; $post = $news_post; ?>
		<?php echo the_excerpt(); ?>
		<? $post = $prev_post;?>
	</div>

</div>
</article>

<?php endif?>