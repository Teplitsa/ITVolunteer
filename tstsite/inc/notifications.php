<?php
/**
	 * Notifications on ITV
	 **/

/** Notification about KMS **/
add_filter('itv_notification_badge', 'itv_notification_badge_screen');
function itv_notification_badge_screen() {
	
	$content = apply_filters('itv_notification_badge_content', '');
	
	if (empty($content))
		return '';
	
	return "<span class='badge'>{$content}</span>";	
}

add_filter('itv_notification_bar', 'itv_notification_bar_screen');
function itv_notification_bar_screen() {
	
	$content = apply_filters('itv_notification_bar_content', '');
	if (empty($content))
		return '';
	
	$label = __('Close', 'itv');	
	return "<div class='alert alert-info alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='{$label}'><span aria-hidden='true'>&times;</span></button>{$content}</div>";	
}

