<?php
/**
 * Template Name: NKO Tags Page
 **/


get_header();?> 

<?php 
$tasks_stats_by_tags = ItvTasksStatsByNKOTags::instance();
$tst_tags_taxonomy_name = 'nko_task_tag';
?>

<?php include('page-tags-general.php');?>

<?php get_footer(); ?>