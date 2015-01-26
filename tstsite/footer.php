<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the id=main div and all content after
 *
 * @package Blank
 */

$cc_link = '<a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons СС-BY-SA 3.0</a>';
$tst = __("Teplitsa of social technologies - crowdsourcing, technologies for the charity", "tst");?>

<div id="bottombar" class="widget-area page-bottom small">

	<div class="row">
	
		<div class="col-md-4">
			<div class="fb-widget">
			<?php dynamic_sidebar('footer_one-sidebar');?>
			</div>
		</div>		
	
		<div class="col-md-4">
			<?php dynamic_sidebar('footer_two-sidebar');?>
			
            <?php
				if( !is_page('contacts') ) {
					get_template_part('contact', 'form');
				}
				else {
					echo '&nbsp;';
				}
			?>
		</div><!-- col-md-4 -->
		
		<div class="col-md-4">
			<div class="te-st"><a href="http://te-st.ru" target="_blank">
			<img src="<?php echo get_template_directory_uri().'/img/tst-banner.png';?>" alt="<?php echo $tst;?>">
			</a></div>
		</div>
	</div>

</div>

</div><!-- .page-decor -->
</div><!-- .contaner -->
</div><!-- #page -->

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
				<div class="rss-link pull-right footer-rss"><a href="<?php echo site_url('/feed/')?>" target="_blank" title="RSS">
				<img src="<?php echo get_template_directory_uri().'/img/rss.png';?>" alt="RSS" width="16">
				</a></div>
			</div>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>

</body>
</html>