<?php

namespace ITV\api\Member;

use \ITV\models\{MemberManager, MemberRatingDoers};

class RatingLIst {
    private static $query_id = 'ratingList';

    public static function add_routes($server) {
        error_log('register_rest_route...');

        register_rest_route( 'itv/v1', '/member/' . self::$query_id . '/(?P<role>[a-z]+)', [
            'methods' => \WP_REST_Server::READABLE,
            'callback' => function($request) {
                $role = $request->get_param('role');
                $month = $request->get_param('month');
                $year = $request->get_param('year');
                $name = $request->get_param('name');

                $request->set_param('query_id', self::$query_id);
                $request->set_param('role', $role);
                $request->set_param('month', $month);
                $request->set_param('year', $year);
                $request->set_param('name', $name);

                $request->set_route('/wp/v2/users');
                return rest_do_request( $request );
            },
        ] );
    
    }

    public static function customize_query($args, $request) {
        $role = $request->get_param('role');
        $month = intval($request->get_param('month'));
        $year = intval($request->get_param('year'));
        $name = $request->get_param('name');

        $query_id = $request->get_param('query_id');
        error_log("query_id: " . $query_id );
        error_log("role: " . $role );
        error_log("month: " . $month );
        error_log("year: " . $year );
        error_log("name: " . $name );

        if($query_id !== self::$query_id) {
            return $args;
        }

        global $wpdb;
        $sql_select = " {$wpdb->users}.* ";
        $sql_from = " FROM {$wpdb->users} ";
        $sql_where = " WHERE 1 ";
        $args_from = [];
        $args_where = [];

        if(in_array($role, [MemberManager::$ROLE_DOER, MemberManager::$ROLE_AUTHOR])) {
            $sql_from .= " INNER JOIN  {$wpdb->usermeta} key1 
                ON  key1.user_id = {$wpdb->users}.ID
                AND key1.meta_key = %s ";
            $sql_where .= "  AND key1.meta_value = %s ";
            $args_from[] = MemberManager::$meta_role;
            $args_where[] = $role;
        }

        if(!empty($name)) {
            $sql_where .= "  AND MATCH ({$wpdb->users}.display_name) AGAINST (%s) ";
            $args_where[] = $name;
        }

        $table = MemberRatingDoers::TABLE;
        $sql_from .= " LEFT JOIN  {$wpdb->prefix}{$table} rating_table
            ON  rating_table.user_id = {$wpdb->users}.ID";
        $sql_select .= ", SUM(rating_table.solved_tasks_count) AS solved_tasks_count ";

        if($month) {
            $sql_where .= " AND rating_table.month = %s ";
            $args_where[] = $month;

            if(!$year) {
                $year = intval(date('Y'));
            }
        }

        $sql_where .= " AND rating_table.year = %s ";
        $args_where[] = $year;

        $sql_group_by = " GROUP BY {$wpdb->users}.ID ";
    
        $args['custom_sql'] = call_user_func_array([$wpdb, 'prepare'], array_merge([$sql_select . $sql_from . $sql_where . $sql_group_by], $args_from, $args_where));    
        $args['custom_sql_order'] = " ORDER BY rating_table.solved_tasks_count DESC, {$wpdb->users}.ID ASC";
    
        return $args;
    }

    public static function filter_users_for_rating($results, $query) {
        global $wpdb;
    
        // error_log("query_vars: " . print_r($query->query_vars, true));
        // error_log("custom_sql:" . $query->query_vars['custom_sql']);
        // error_log("custom_sql_order:" . $query->query_vars['custom_sql_order']);
    
        if(!empty($query->query_vars['custom_sql'])) {
            $query->query_fields = $query->query_vars['custom_sql'];
            $query->query_from = "";
            $query->query_where = "";
        }
    
        if(!empty($query->query_vars['custom_sql_order'])) {
            $query->query_orderby = $query->query_vars['custom_sql_order'];
        }
    
        return $results;
    }

    public static function rating_prepare_user($response, $user, $request) {
        // error_log("data: " . print_r($response->data, true));
        // error_log("user.solved_tasks_count: " . $user->solved_tasks_count);
        $response->data[MemberManager::$FIELD_RATING_SOLVED_TASKS_COUNT] = $user->solved_tasks_count;
        return $response;
    }
}

add_action( 'rest_api_init', '\ITV\api\Member\RatingLIst::add_routes' );
add_filter( 'rest_user_query', '\ITV\api\Member\RatingLIst::customize_query', 10, 2 );
add_filter( 'users_pre_query', '\ITV\api\Member\RatingLIst::filter_users_for_rating', 10, 2 );
add_filter( 'rest_prepare_user', '\ITV\api\Member\RatingLIst::rating_prepare_user', 10, 3 );
