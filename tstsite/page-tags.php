<?php
/**
 * Template Name: Tags Page
 **/


get_header();?> 

<?php 
$tasks_stats_by_tags = ItvTasksStatsByTags::instance();
$tags = get_terms('post_tag', array('hide_empty' => 1, 'orderby' => 'count', 'order' => 'DESC'));
?>

<?php include('page-tags-general.php');?>

<?php get_footer(); ?>