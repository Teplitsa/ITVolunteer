<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content after
 *
 * @package Blank
 */

$cc_link = '<a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons СС-BY-SA.&nbsp;3.0</a>';


function tst_brand_banner() {
?>
	<div class="te-st">
		<a href="http://te-st.ru" target="_blank">			
			Теплица социальных технологий
		</a>
	</div>
<?php
}

?>

<div id="bottombar" class="widget-area page-bottom small">
<div class="row">
<?php if(is_page('registration')) { ?>
	<div class="col-sm-6 registration-col-1">
		<?php get_template_part('partials/contact', 'form'); ?>
	</div>
	<div class="col-sm-6 registration-col-2">
		<?php tst_brand_banner();?>
	</div>
	
<?php } else { ?>

	<div class="col-md-9">
	<div class="row">
		<div class="col-sm-12 col-md-4 footer-info">
			<div class="widget">
				<div class="footer-brand">
					<a href="" class="footer-logo"><?php bloginfo('name');?></a>
					<div class="beta-label"><?php _e('Beta-version', 'tst');?></div>
				</div>
				
				<div class="footer-stat">
					<p><?php _e('Total members:', 'tst') ?> <?php echo tst_get_active_members_count(); ?></p>
					<p><?php _e('Total tasks:', 'tst') ?> <?php echo tst_get_all_tasks_count(); ?></p>
					<p><?php _e('Tasks completed:', 'tst') ?> <?php echo tst_get_closed_tasks_count(); ?></p>
				</div>
				
				<div class="footer-contact">
				<?php
					if( !is_page('contacts') ) {
						get_template_part('partials/contact', 'form');
					}
					else {
						echo '&nbsp;';
					}
				?>
				</div>
			</div>
		</div><!-- .col-md-4  -->	
		
		<div class="col-sm-6 col-md-4">
			<?php dynamic_sidebar('footer_one-sidebar');?>		
		</div><!-- .col-md-4  -->
		
		<div class="col-sm-6 col-md-4">
			<?php dynamic_sidebar('footer_two-sidebar');?>		
		</div><!-- .col-md-4  -->
		
	</div><!-- .row  -->	
	</div>
	
	<div class="col-md-3">
		<?php tst_brand_banner();?>		
	</div>
		
<?php } ?>
</div>
</div><!-- #bottombar -->

</div><!-- .page-decor -->
</div><!-- .contaner -->

<footer id="colophon" class="site-footer" role="contentinfo">
	<div class="container">
		<div class="row">
			<div class="col-md-6">
				<div class="copy">
					<!-- <a href="<?php home_url();?>"><?php bloginfo('name');?></a>-->
					<?php printf(__('All materials of the site are avaliabe under license %s', 'tst'), $cc_link);?>
				</div>
			</div>
			
			<div class="col-md-6">
				<div class="rss-link pull-right footer-rss">
					<a href="<?php echo site_url('/feed/')?>" target="_blank" title="RSS">RSS</a>
				</div>
			</div>
		</div>
	</div>
</footer>


</div><!-- #page -->
</div><!-- .site-layout -->
</div><!-- .site-layout-container-->


<?php wp_footer(); ?>

</body>
</html>
