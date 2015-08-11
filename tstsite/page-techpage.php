<?php
/**
 * Template Name: Techpage
 * 
 */
 
get_header();
if(current_user_can( 'manage_options' )) {
	
	$action = $_GET['itv_action'];
	$include_file_path = get_template_directory() . '/page-techpage_' . $action . '.php';
?>

<?php if(is_file($include_file_path)):?>
	<?php include($include_file_path);?>
<?php else {
	:?>
	<?php echo "<br /><h1>Action not found!!!</h1>"?>
<?php endif?>


<?php 
}
get_footer();
}
