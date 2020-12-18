<?php

load_theme_textdomain( 'itv-backend', get_theme_file_path() . '/lang' );

// models
require_once( get_theme_file_path() . '/models/member/portfolio.php' );
require_once( get_theme_file_path() . '/models/member/member.php' );
require_once( get_theme_file_path() . '/models/task/task.php' );
require_once( get_theme_file_path() . '/models/member/member-tasks.php' );
require_once( get_theme_file_path() . '/models/member/notif.php' );

// post-types
require_once( get_theme_file_path() . '/post-types/portfolio_work.php' );

// rest-api
require_once( get_theme_file_path() . '/rest-api/auth.php' );
require_once( get_theme_file_path() . '/rest-api/member/portfolio.php' );
require_once( get_theme_file_path() . '/rest-api/member/role.php' );
require_once( get_theme_file_path() . '/rest-api/member/member.php' );
require_once( get_theme_file_path() . '/rest-api/member/review.php' );
require_once( get_theme_file_path() . '/rest-api/member/notif.php' );
require_once( get_theme_file_path() . '/rest-api/task/task.php' );

// wp-cli
require_once( get_theme_file_path() . '/wp-cli/set_members_itv_role.php' );
