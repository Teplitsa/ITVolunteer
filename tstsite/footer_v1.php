<?php
use ITV\models\UserXPModel;
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
					<p><?php _e('Total site users xp:', 'tst') ?> <?php echo UserXPModel::instance()->get_site_total_abs_xp(); ?></p>
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

<div class="alert alert-success itv-xp-alert" id="itv-xp-alert"><i class="glyphicon glyphicon-certificate"></i><span class="itv-xp-alert-text">Вы заработали 10 очков опыта!</span></div>

</div><!-- #page -->
</div><!-- .site-layout -->

<!-- sharing -->
<?php do_action('tst_layout_footer');?>
</div><!-- .site-layout-container-->

<?php wp_footer(); ?>

<script>
jQuery(function($){
	if(typeof ga == 'function') {		
        let triggerId = 'ge_show_old_desing';
			
        //debug
        if (ga_events[triggerId]) {
            console.log(ga_events[triggerId].ga_category);
            console.log(ga_events[triggerId].ga_action);
            console.log(ga_events[triggerId].ga_label);
        
            ga('send', 'event', ga_events[triggerId].ga_category, ga_events[triggerId].ga_action, ga_events[triggerId].ga_label, 1);	
        }
	}	
});
</script>

</body>
</html>
