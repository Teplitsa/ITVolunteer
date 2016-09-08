<?php
/**
 * Template Name: Tags Page
 **/


get_header();?> 

<?php 
$tasks_stats_by_tags = ItvTasksStatsByTags::instance();
$tst_tags_taxonomy_name = 'post_tag';
?>

<?php include('page-tags-general.php');?>

<?php get_footer(); ?>