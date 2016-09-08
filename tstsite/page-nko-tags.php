<?php
/**
 * Template Name: NKO Tags Page
 **/


get_header();?> 

<?php 
$tasks_stats_by_tags = ItvTasksStatsByNKOTags::instance();
$tags = get_terms('nko_task_tag', array('hide_empty' => 1, 'orderby' => 'count', 'order' => 'DESC'));
?>

<?php include('page-tags-general.php');?>

<?php get_footer(); ?>