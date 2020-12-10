<?php

load_theme_textdomain( 'itv-backend', get_theme_file_path() . '/lang' );

// models
require_once( get_theme_file_path() . '/models/member/portfolio.php' );
require_once( get_theme_file_path() . '/models/member/member.php' );
require_once( get_theme_file_path() . '/models/task/task.php' );
require_once( get_theme_file_path() . '/models/member/member-tasks.php' );

// post-types
require_once( get_theme_file_path() . '/post-types/portfolio_work.php' );

// rest-api
require_once( get_theme_file_path() . '/rest-api/auth.php' );
require_once( get_theme_file_path() . '/rest-api/member/portfolio.php' );
require_once( get_theme_file_path() . '/rest-api/member/role.php' );
require_once( get_theme_file_path() . '/rest-api/member/member.php' );
