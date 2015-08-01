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

$news_posts = new WP_Query( $args );

?>

<?php
if($news_posts->have_posts()): while($news_posts->have_posts()) : $news_posts->the_post();
?>
<article <?php post_class('col-md-6 home-news item-masonry'); ?>>
<div class="border-card">
	<h2>Новости проекта</h2>
	
	<h4>				
		<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
	</h4>	
	
	<div class="home-news-content">
		<?php $thumbnail = get_the_post_thumbnail(get_the_ID(), 'embed')?>
		<?php if ( $thumbnail ): ?>
			<a href="<?php the_permalink(); ?>" class="thumb-link"><?php echo $thumbnail ?></a>
		<?php endif?>
		
		<?php echo the_excerpt(); ?>
		
	</div>

</div>
</article>

<?php endwhile; endif; wp_reset_postdata(); ?>