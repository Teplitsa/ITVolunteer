<?php
class ItvTasksStats {
	
	private static $_instance = NULL;
	
	
	private function __construct() {
	}
	
	
	public static function instance() {
		if(ItvTasksStats::$_instance == NULL) {
			ItvTasksStats::$_instance = new ItvTasksStats();
		}
		return ItvTasksStats::$_instance;
	}
	
	public function refresh_tasks_stats_by_tags($per_page = 100) {
		global $wpdb;
		
		$tags = get_terms('post_tag', array('hide_empty' => 1, 'orderby' => 'count', 'order' => 'DESC'));
		$tasks_stats_by_tags = ItvTasksStatsByTags::instance();
		if(!empty($tags)){
			foreach($tags as $tag){
				tst_correct_tag_count($tag->term_taxonomy_id, $tag->taxonomy);
				
				$posts_count = array();
				$posts_count['publish'] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->term_relationships, $wpdb->posts WHERE $wpdb->posts.ID = $wpdb->term_relationships.object_id AND post_status = 'publish' AND post_type IN ('tasks') AND term_taxonomy_id = %d", $tag->term_taxonomy_id ));
				$posts_count['in_work'] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->term_relationships, $wpdb->posts WHERE $wpdb->posts.ID = $wpdb->term_relationships.object_id AND post_status = 'in_work' AND post_type IN ('tasks') AND term_taxonomy_id = %d", $tag->term_taxonomy_id ));
				$posts_count['closed'] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->term_relationships, $wpdb->posts WHERE $wpdb->posts.ID = $wpdb->term_relationships.object_id AND post_status = 'closed' AND post_type IN ('tasks') AND term_taxonomy_id = %d", $tag->term_taxonomy_id ));
				$posts_count['archived'] = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->term_relationships, $wpdb->posts WHERE $wpdb->posts.ID = $wpdb->term_relationships.object_id AND post_status = 'archived' AND post_type IN ('tasks') AND term_taxonomy_id = %d", $tag->term_taxonomy_id ));
				
				$tasks_stats_by_tags->update_tag_stats($tag->term_taxonomy_id, $posts_count);
				
			}
		}
		
		$query_params = array(
			'post_type' => 'tasks',
			'post_status' => 'closed',
		);
		
		$query = new WP_Query($query_params);
		
		$no_doer_tasks = array();
		$several_doers_tasks = array();
		
		$counter = 0;
		while($query->have_posts()) {
			$query->the_post();
		}
	}
}

class ItvTasksStatsByTags {
	private static $_instance = NULL;
	
	public function __construct() {
		global $wpdb;
		$this->task_stats_by_tags_table = $wpdb->prefix.'itv_task_stats_by_tags';
	}
	
	public static function instance() {
		if(ItvTasksStatsByTags::$_instance == NULL) {
			ItvTasksStatsByTags::$_instance = new ItvTasksStatsByTags();
		}
		return ItvTasksStatsByTags::$_instance;
	}
	
	public function update_tag_stats($term_id, $posts_count) {
		global $wpdb;
		
		$total = (int)$posts_count['publish'] + (int)$posts_count['in_work'] + (int)$posts_count['closed'] + (int)$posts_count['archived'];
		
		$wpdb->query(
			$wpdb->prepare(
				"
				REPLACE INTO $this->task_stats_by_tags_table
				SET term_id = %d, total = %d, publish = %d, in_work = %d, closed = %d, archived = %d, time_update = NOW()
				",
				$term_id, $total, (int)$posts_count['publish'], (int)$posts_count['in_work'], (int)$posts_count['closed'], (int)$posts_count['archived']
			)
		);
	}
	
	public function get_tag_stats($term_id) {
		global $wpdb;
	
		$stats = $wpdb->get_row(
				$wpdb->prepare(
						"
						SELECT * FROM $this->task_stats_by_tags_table
						WHERE term_id = %d
						LIMIT 1
						",
						$term_id
				)
		);
	
		return $stats;
	}
	
	public function get_max_posts_count_by_tags() {
		global $wpdb;
	
		$max = $wpdb->get_var("SELECT MAX(total) FROM $this->task_stats_by_tags_table");
	
		return $max;
	}
}

ItvTasksStats::instance();
