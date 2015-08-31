<?php
/**
 * Submit metabox Component
 *
 * @package Frl_framework
 * @subpackage Frl_engine
 */


class Tst_Task_Submitbox {

    var $post_object;
    var $post_type;
    var $post_type_object;
    var $can_publish;
    var $args;


    /**
     * Constructions
     * */
    public function __construct(WP_Post $post, $params = array()){

        $this->post_object = $post;
        $this->post_type = $post->post_type;
        $this->post_type_object = get_post_type_object($this->post_type);
        $this->can_publish = current_user_can($this->post_type_object->cap->publish_posts);

        $def = $this->_get_default_args();
        $this->args = wp_parse_args($params['args'], $def);
    }

    protected function _get_default_args(){

        return array( //defaults produce native metabox
            'visibility_format' => 'normal', //normal/hide
            'date_format'       => 'normal', //normal/only_year/no_date
            'date_label'        => ''
        );
    }


    /**
     * Final printing
     **/
    public function print_metabox(){

        ?>
        <div class="submitbox" id="submitdiv">

            <?php $this->minor_publishing_block();?>
            <?php $this->major_publishing_block();?>
        </div>
    <?php
    }



    /**
     * Publishing block
     * */
    public function minor_publishing_block() {

        ?>
        <div id="minor-publishing">

            <?php $this->minor_buttons(); ?>

            <div id="misc-publishing-actions">
                <?php
                $this->minor_status(); //status settings
//                $this->minor_visibility(); //visibility settings

                do_action('post_submitbox_misc_actions', $this->post_object, $this->can_publish);

//                $this->minor_date(); //date settings - always last
                ?>
            </div><div class="clear"></div>
        </div>

    <?php
    }

    public function major_publishing_block() {

        $post = $this->post_object;
        $can_publish = $this->can_publish;
        ?>
        <div id="major-publishing-actions">
            <?php do_action('post_submitbox_start'); ?>

            <div id="delete-action">
                <?php
                if ( current_user_can( "delete_post", $post->ID ) ) :
                    if ( !EMPTY_TRASH_DAYS )
                        $delete_text = __('Delete Permanently');
                    else
                        $delete_text = __('Move to Trash');
                    ?>
                    <a class="submitdelete deletion" href="<?php echo get_delete_post_link($post->ID); ?>"><?php echo $delete_text; ?></a>
                <?php endif; ?>
            </div>

            <div id="publishing-action">
                <img src="<?php echo esc_url( admin_url( 'images/wpspin_light.gif' ) ); ?>" class="ajax-loading" id="ajax-loading" alt="" />
                <?php
                if ( !in_array( $post->post_status, array('publish', 'future', 'private') ) || 0 == $post->ID ) {
                    if ( $can_publish ) :
                        if ( !empty($post->post_date_gmt) && time() < strtotime( $post->post_date_gmt . ' +0000' ) ) : ?>
                            <input name="original_publish" type="hidden" id="original_publish" value="<?php esc_attr_e('Schedule') ?>" />
                            <?php submit_button( __( 'Schedule' ), 'primary', 'publish', false, array( 'tabindex' => '5', 'accesskey' => 'p' ) ); ?>
                        <?php	else : ?>
                            <input name="original_publish" type="hidden" id="original_publish" value="<?php esc_attr_e('Publish') ?>" />
                            <?php submit_button( __( 'Publish', 'tst' ), 'primary', 'publish', false, array( 'tabindex' => '5', 'accesskey' => 'p' ) ); ?>
                        <?php	endif;
                    else : ?>
                        <input name="original_publish" type="hidden" id="original_publish" value="<?php esc_attr_e('Submit for Review') ?>" />
                        <?php submit_button( __( 'Submit for Review' ), 'primary', 'publish', false, array( 'tabindex' => '5', 'accesskey' => 'p' ) ); ?>
                    <?php
                    endif;
                } else { ?>
                    <input name="original_publish" type="hidden" id="original_publish" value="<?php esc_attr_e('Update') ?>" />
                    <input name="save" type="submit" class="button-primary" id="publish" tabindex="5" accesskey="p" value="<?php esc_attr_e('Update') ?>" />
                <?php
                } ?>
            </div>

            <div class="clear"></div>
        </div>
    <?php
    }



    /**
     * Publishing sub-blocks
     *
     * original copy-pasting from WP code
     * with some custom hooks
     **/

    /* draft and preview buttons */
    public function minor_buttons(){

        $post = $this->post_object;
        $can_publish = $this->can_publish;

        ?>
        <div id="minor-publishing-actions">
            <div id="save-action">
                <?php if ( 'publish' != $post->post_status && 'future' != $post->post_status && 'pending' != $post->post_status )  { ?>
                    <input <?php if ( 'private' == $post->post_status ) { ?>style="display:none"<?php } ?> type="submit" name="save" id="save-post" value="<?php esc_attr_e('Save Draft'); ?>" tabindex="4" class="button button-highlighted" />
                <?php } elseif ( 'pending' == $post->post_status && $can_publish ) { ?>
                    <input type="submit" name="save" id="save-post" value="<?php esc_attr_e('Save as Pending'); ?>" tabindex="4" class="button button-highlighted" />
                <?php } ?>
                <img src="<?php echo esc_url( admin_url( 'images/wpspin_light.gif' ) ); ?>" class="ajax-loading" id="draft-ajax-loading" alt="" />
            </div>

            <div id="preview-action">

                <?php
                //is post type support preview ???
                $post_object = get_post_type_object($post->post_type);
                if(isset($post_object->frl_config['slug']) && false === $post_object->frl_config['slug']):
                    //should we do smth here ???

                else:

                    if ( 'publish' == $post->post_status ) {
                        $preview_link = esc_url( get_permalink( $post->ID ) );
                        $preview_button = __( 'Preview Changes' );
                    } else {
                        $preview_link = get_permalink( $post->ID );
                        if ( is_ssl() )
                            $preview_link = str_replace( 'http://', 'https://', $preview_link );
                        $preview_link = esc_url( apply_filters( 'preview_post_link', add_query_arg( 'preview', 'true', $preview_link ) ) );
                        $preview_button = __( 'Preview' );
                    }
                    ?>
                    <a class="preview button" href="<?php echo $preview_link; ?>" target="wp-preview" id="post-preview" tabindex="4"><?php echo $preview_button; ?></a>
                    <input type="hidden" name="wp-preview" id="wp-preview" value="" />
                <?php endif;?>

            </div>

            <div class="clear"></div>
        </div>
        <?php // /minor-publishing-actions
    }


    /**
     * Status selection dealogue
     **/
    public function minor_status(){

        $post = $this->post_object;
        $can_publish = $this->can_publish;
        ?>

    <div class="misc-pub-section<?php if ( !$can_publish ) { echo ' misc-pub-section-last'; } ?>"><label for="post_status"><?php _e('Status:') ?></label>
        <span id="post-status-display">
        <?php 
        switch ( $post->post_status ) {

            case 'draft':
            case 'auto-draft':
                _e('Draft', 'tst');
                break;
            case 'publish':
                _e('Published', 'tst');
                break;
            case 'in_work':
                _e('In work', 'tst');
                break;
            case 'closed':
                _e('Closed', 'tst');
                break;
            case 'archived':
                _e('Archived', 'tst');
                break;
            default:
                echo apply_filters('post_status_label', '', $post, $can_publish);
                break;
        }
        ?>
        </span>
        <?php if ( 'publish' == $post->post_status || $can_publish ) { ?>
            <a href="#post_status" <?php if ( 'private' == $post->post_status ) { ?>style="display:none;" <?php } ?>class="edit-post-status hide-if-no-js" tabindex='4'><?php _e('Edit') ?></a>

            <div id="post-status-select" class="hide-if-js">
                <input type="hidden" name="hidden_post_status" id="hidden_post_status" value="<?php echo esc_attr( ('auto-draft' == $post->post_status ) ? 'draft' : $post->post_status); ?>" />
                <select name='post_status' id='post_status' tabindex='4'>

                    <?php ?>
                        <option <?php if('draft' == $post->post_status) selected($post->post_status, 'draft'); ?> value='draft'><?php _e('Draft', 'tst');?></option>
                        <option<?php if('publish' == $post->post_status) selected( $post->post_status, 'publish' ); ?> value='publish'><?php _e('Published', 'tst');?></option>
                        <option<?php if('in_work' == $post->post_status) selected( $post->post_status, 'in_work' ); ?> value='in_work'><?php _e('In work', 'tst');?></option>
                        <option<?php if('closed' == $post->post_status) selected( $post->post_status, 'closed' );?> value='closed'><?php _e('Closed', 'tst');?></option>
                        <option<?php if('archived' == $post->post_status) selected( $post->post_status, 'archived' );?> value='archived'><?php _e('Archived', 'tst');?></option>
                        <?php do_action('post_status_dropdown', $post); ?>
                </select>
                <a href="#post_status" id="save-task-status" class="save-post-status hide-if-no-js button"><?php _e('OK'); ?></a>
                <a href="#post_status" class="cancel-post-status hide-if-no-js"><?php _e('Cancel'); ?></a>
            </div>

        <?php } ?>
        </div><?php // /misc-pub-section 

    }

    /**
     * visibility setting dialogue
     **/
    public function minor_visibility(){

        $post = $this->post_object;
        $can_publish = $this->can_publish;
        $visibility_format = $this->args['visibility_format'];

        if($visibility_format == 'normal'):

            ?>
            <div class="misc-pub-section " id="visibility">
                <?php _e('Visibility:'); ?> <span id="post-visibility-display"><?php

                    if ( 'private' == $post->post_status ) {
                        $post->post_password = '';
                        $visibility = 'private';
                        $visibility_trans = __('Private');
                    } elseif ( !empty( $post->post_password ) ) {
                        $visibility = 'password';
                        $visibility_trans = __('Password protected');
                    } elseif ( $post->post_type == 'post' && is_sticky( $post->ID ) ) {
                        $visibility = 'public';
                        $visibility_trans = __('Public, Sticky');
                    } else {
                        $visibility = 'public';
                        $visibility_trans = __('Public');
                    }

                    echo esc_html( $visibility_trans ); ?></span>
                <?php if ( $can_publish ) { ?>
                    <a href="#visibility" class="edit-visibility hide-if-no-js"><?php _e('Edit'); ?></a>

                    <div id="post-visibility-select" class="hide-if-js">
                        <input type="hidden" name="hidden_post_password" id="hidden-post-password" value="<?php echo esc_attr($post->post_password); ?>" />
                        <?php if ($post->post_type == 'post'): ?>
                            <input type="checkbox" style="display:none" name="hidden_post_sticky" id="hidden-post-sticky" value="sticky" <?php checked(is_sticky($post->ID)); ?> />
                        <?php endif; ?>
                        <input type="hidden" name="hidden_post_visibility" id="hidden-post-visibility" value="<?php echo esc_attr( $visibility ); ?>" />


                        <input type="radio" name="visibility" id="visibility-radio-public" value="public" <?php checked( $visibility, 'public' ); ?> /> <label for="visibility-radio-public" class="selectit"><?php _e('Public'); ?></label><br />
                        <?php if ($post->post_type == 'post'): ?>
                            <span id="sticky-span"><input id="sticky" name="sticky" type="checkbox" value="sticky" <?php checked(is_sticky($post->ID)); ?> tabindex="4" /> <label for="sticky" class="selectit"><?php _e('Stick this post to the front page') ?></label><br /></span>
                        <?php endif; ?>
                        <input type="radio" name="visibility" id="visibility-radio-password" value="password" <?php checked( $visibility, 'password' ); ?> /> <label for="visibility-radio-password" class="selectit"><?php _e('Password protected'); ?></label><br />
                        <span id="password-span"><label for="post_password"><?php _e('Password:'); ?></label> <input type="text" name="post_password" id="post_password" value="<?php echo esc_attr($post->post_password); ?>" /><br /></span>
                        <input type="radio" name="visibility" id="visibility-radio-private" value="private" <?php checked( $visibility, 'private' ); ?> /> <label for="visibility-radio-private" class="selectit"><?php _e('Private'); ?></label><br />

                        <p>
                            <a href="#visibility" class="save-post-visibility hide-if-no-js button"><?php _e('OK'); ?></a>
                            <a href="#visibility" class="cancel-post-visibility hide-if-no-js"><?php _e('Cancel'); ?></a>
                        </p>
                    </div>
                <?php } ?>

            </div>

        <?php elseif($visibility_format == 'hide'): ?>

            <div class="misc-pub-section " id="visibility" style="display: none;">
                <input type="hidden" name="hidden_post_visibility" id="hidden-post-visibility" value="public" />
                <input type="radio" name="visibility" id="visibility-radio-public" value="public" checked="checked" />
            </div>
        <?php endif;
    }

    /**
     * Static function for date-time selection fields varous cases
     **/

    /* function to display hidden time fields when no date mode */
    public static function no_date_touch_time(){
        global $post;

        $edit = !( in_array($post->post_status, array('draft', 'pending', 'auto-draft') ) && (!$post->post_date_gmt || '0000-00-00 00:00:00' == $post->post_date_gmt ) );

        $init_string = date('Y', current_time('timestamp'));
        $time_adj = strtotime($init_string.'-01-01');

        $post_date = $post->post_date;
        $jj = ($edit) ? mysql2date( 'd', $post_date, false ) : gmdate( 'd', $time_adj );
        $mm = ($edit) ? mysql2date( 'm', $post_date, false ) : gmdate( 'm', $time_adj );
        $aa = ($edit) ? mysql2date( 'Y', $post_date, false ) : gmdate( 'Y', $time_adj );
        $hh = ($edit) ? mysql2date( 'H', $post_date, false ) : gmdate( 'H', $time_adj );
        $mn = ($edit) ? mysql2date( 'i', $post_date, false ) : gmdate( 'i', $time_adj );
        $ss = ($edit) ? mysql2date( 's', $post_date, false ) : gmdate( 's', $time_adj );

        $date =  "<input type='hidden' name='mm' value='$mm' id='mm'/>";
        $date .= "<input type='hidden' id='jj' name='jj' value='$jj' />";
        $date .= '<input type="hidden" id="aa" name="aa" value="' . $aa . '"/>';
        $date .= '<input type="hidden" id="hh" name="hh" value="'.$hh.'" />';
        $date .= '<input type="hidden" id="mn" name="mn" value="' . $mn . '" />';
        $date .= '<input type="hidden" id="ss" name="ss" value="' . $ss . '" />';

        echo $date;
    }


    /* function to display time controls for year only metabox */
    public static function touch_time_by_year($tab_index = 0) {
        global $post;

        $edit = !( in_array($post->post_status, array('draft', 'pending', 'auto-draft') ) && (!$post->post_date_gmt || '0000-00-00 00:00:00' == $post->post_date_gmt ) );

        $tab_index_attribute = '';
        if ( (int) $tab_index > 0 )
            $tab_index_attribute = " tabindex=\"$tab_index\"";

        $init_string = date('Y', current_time('timestamp'));
        $time_adj = strtotime($init_string.'-01-01');

        $post_date = $post->post_date;
        $jj = ($edit) ? mysql2date( 'd', $post_date, false ) : gmdate( 'd', $time_adj );
        $mm = ($edit) ? mysql2date( 'm', $post_date, false ) : gmdate( 'm', $time_adj );
        $aa = ($edit) ? mysql2date( 'Y', $post_date, false ) : gmdate( 'Y', $time_adj );
        $hh = ($edit) ? mysql2date( 'H', $post_date, false ) : gmdate( 'H', $time_adj );
        $mn = ($edit) ? mysql2date( 'i', $post_date, false ) : gmdate( 'i', $time_adj );
        $ss = ($edit) ? mysql2date( 's', $post_date, false ) : gmdate( 's', $time_adj );


        $month = "<input type='hidden' name='mm' value='$mm' id='mm'/>";
        $day = "<input type='hidden' id='jj' name='jj' value='$jj' />";
        $year = '<input type="text" id="aa" name="aa" value="' . $aa . '" size="4" maxlength="4"' . $tab_index_attribute . ' autocomplete="off" />';
        $hour = '<input type="hidden" id="hh" name="hh" value="'.$hh.'" />';
        $minute = '<input type="hidden" id="mn" name="mn" value="' . $mn . '" />';
        $sec = '<input type="hidden" id="ss" name="ss" value="' . $ss . '" />';

        echo '<div class="timestamp-wrap">';
        /* print year selection */
        printf(__('Set year %s', 'frl-engine'), $year);
        echo '</div>';
        /* hidden fields */
        echo $month;
        echo $day;
        echo $hour;
        echo $minute;
        echo $sec;

        echo "\n\n";
        foreach ( array('mm', 'jj', 'aa', 'hh', 'mn') as $timeunit ) {
            echo '<input type="hidden" id="hidden_' . $timeunit . '" name="hidden_' . $timeunit . '" value="' . $$timeunit . '" />' . "\n";
            $cur_timeunit = 'cur_' . $timeunit;
            echo '<input type="hidden" id="'. $cur_timeunit . '" name="'. $cur_timeunit . '" value="' . $$cur_timeunit . '" />' . "\n";
        }
        ?>
        <p>
            <a href="#edit_timestamp" class="save-timestamp-year hide-if-no-js button"><?php _e('OK'); ?></a>
            <a href="#edit_timestamp" class="cancel-timestamp-year hide-if-no-js"><?php _e('Cancel'); ?></a>
        </p>
    <?php
    }


    /* helper to display custom data-select dialogue */
    public static function custom_touch_time($start_date='',  $tab_index = 0, $prefix = 'frl_' ) {
        global $wp_locale;

        $tab_index_attribute = '';
        if ( (int) $tab_index > 0 )
            $tab_index_attribute = " tabindex=\"$tab_index\"";

        $time_adj = current_time('timestamp');

        $jj = (!empty($start_date)) ? mysql2date( 'd', $start_date, false ) : gmdate( 'd', $time_adj );
        $mm = (!empty($start_date)) ? mysql2date( 'm', $start_date, false ) : gmdate( 'm', $time_adj );
        $aa = (!empty($start_date)) ? mysql2date( 'Y', $start_date, false ) : gmdate( 'Y', $time_adj );
        $hh = (!empty($start_date)) ? mysql2date( 'H', $start_date, false ) : gmdate( 'H', $time_adj );
        $mn = (!empty($start_date)) ? mysql2date( 'i', $start_date, false ) : gmdate( 'i', $time_adj );
        $ss = (!empty($start_date)) ? mysql2date( 's', $start_date, false ) : gmdate( 's', $time_adj );


        $month = "<select id= \"{$prefix}mm\" name=\"{$prefix}mm\"$tab_index_attribute>\n";
        for ( $i = 1; $i < 13; $i = $i +1 ) {
            $monthnum = zeroise($i, 2);
            $month .= "\t\t\t" . '<option value="' . $monthnum . '"';
            if ( $i == $mm )
                $month .= ' selected="selected"';
            $month .= '>' . sprintf( __( '%1$s-%2$s' ), $monthnum, $wp_locale->get_month_abbrev( $wp_locale->get_month( $i ) ) ) . "</option>\n";
        }
        $month .= '</select>';

        $day = '<input type="text" id="'.$prefix.'jj" name="'.$prefix.'jj" value="' . $jj . '" size="2" maxlength="2"' . $tab_index_attribute . ' autocomplete="off" />';
        $year = '<input type="text" id="' .$prefix. 'aa" name="'.$prefix.'aa" value="' . $aa . '" size="4" maxlength="4"' . $tab_index_attribute . ' autocomplete="off" />';
        $hour = '<input type="text" id="' . $prefix . 'hh" name="'.$prefix.'hh" value="' . $hh . '" size="2" maxlength="2"' . $tab_index_attribute . ' autocomplete="off" />';
        $minute = '<input type="text" id="' . $prefix . 'mn" name="'.$prefix.'mn" value="' . $mn . '" size="2" maxlength="2"' . $tab_index_attribute . ' autocomplete="off" />';

        echo '<div class="timestamp-wrap">';
        /* translators: 1: month input, 2: day input, 3: year input, 4: hour input, 5: minute input */
        printf(__('%1$s%2$s, %3$s @ %4$s : %5$s'), $month, $day, $year, $hour, $minute);

        echo '</div><input type="hidden" id="'.$prefix.'ss" name="'.$prefix.'ss" value="' . $ss . '" />';

        //hidden section
        echo "\n\n";
        foreach ( array('mm', 'jj', 'aa', 'hh', 'mn') as $timeunit ) {
            echo '<input type="hidden" id="hidden_' .$prefix.$timeunit . '" name="hidden_' .$prefix.$timeunit . '" value="' . $$timeunit . '" />' . "\n";

        }
    }
} // Metabox class end

add_action('admin_menu', function(){
    remove_meta_box('submitdiv', 'tasks', 'side');
    remove_meta_box('rewarddiv', 'tasks', 'side'); 
    remove_meta_box('categorydiv', 'tasks', 'side');
});

add_action('add_meta_boxes', function($post_type){
    if($post_type != 'tasks')
        return;

    global $post;

    $metabox = new Tst_Task_Submitbox($post, array('args' => array(
        'visibility_format' => false,
    )));

    add_meta_box(
        'task_status',
        __('Task status', 'tst'),
        array($metabox, 'print_metabox'),
        'tasks',
        'side',
        'high'
    );
});


/**
* remove SEO columns
**/
add_action('admin_init', function(){
	foreach(get_post_types(array('public' => true), 'names') as $pt) {
		add_filter('manage_' . $pt . '_posts_columns', 'frl_clear_seo_columns', 100);
	}
	
	if(isset($GLOBALS['wpseo_admin'])){
		$wp_seo = $GLOBALS['wpseo_admin'];	
		remove_action('show_user_profile', array($wp_seo, 'user_profile'));
		remove_action('edit_user_profile', array($wp_seo, 'user_profile'));
	}	
	
}, 100);

function frl_clear_seo_columns($columns){

	if(isset($columns['wpseo-score']))
		unset($columns['wpseo-score']);
	
	if(isset($columns['wpseo-title']))
		unset($columns['wpseo-title']);
	
	if(isset($columns['wpseo-metadesc']))
		unset($columns['wpseo-metadesc']);
	
	if(isset($columns['wpseo-focuskw']))
		unset($columns['wpseo-focuskw']);
	
	return $columns;
}

add_filter('wpseo_use_page_analysis', '__return_false');


/** Columns on task screen **/
add_filter('manage_posts_columns', 'itv_common_columns_names', 50, 2);
function itv_common_columns_names($columns, $post_type) {
		
	if(!in_array($post_type, array('post', 'tasks', 'attachment')))
		return $columns;

	
	if($post_type == 'tasks'){
		$columns['rewards'] = 'Награда';
	}
	
    
     if($post_type == 'post'){       
		$columns['thumbnail'] = 'Миниат.';
    }
	
	
	return $columns;
}

add_action('manage_posts_custom_column', 'itv_common_columns_content', 2, 2);
function itv_common_columns_content($column_name, $post_id) {
		
	if($column_name == 'rewards') {
		
        $term_id = get_field('reward', $post_id);
        if($term_id){
            $term = get_term($term_id, 'reward');
            if($term)
                echo apply_filters('single_cat_title', $term->name);
        }
	}
    elseif($column_name == 'thumbnail'){
        $img = get_the_post_thumbnail($post_id, 'thumbnail');
		if(empty($img))
			echo "&ndash;";
        else
			echo "<div class='admin-tmb'>{$img}</div>";
    }
   
}


/* admin tax columns */
add_filter('manage_taxonomies_for_tasks_columns', function($taxonomies){
    
    $key = array_search('category', $taxonomies);
	if($key)
        unset($taxonomies[$key]);
	
    return $taxonomies;
});


/* no SEO options in user profile */
add_action('admin_init', 'itv_clean_user_profile');
function itv_clean_user_profile(){
    global $wp_filter;
    
    if(isset($wp_filter['show_user_profile'][10])){
        foreach($wp_filter['show_user_profile'][10] as $i => $func){
            if($wp_filter['show_user_profile'][10][$i]['function'][1] == 'user_profile')
                unset($wp_filter['show_user_profile'][10][$i]);
        }
    }
    
    if(isset($wp_filter['edit_user_profile'][10])){
        foreach($wp_filter['edit_user_profile'][10] as $i => $func){
            if($wp_filter['edit_user_profile'][10][$i]['function'][1] == 'user_profile')
                unset($wp_filter['edit_user_profile'][10][$i]);
        }
    }  
    
}


/* User table columns */
add_filter("manage_users_columns", 'itv_user_columns_names');
function itv_user_columns_names($columns){
    
    $columns['particip'] = __('Participation', 'tst');
    
    return $columns;
}

add_filter('manage_users_custom_column', 'itv_user_columns_content', 2, 3);
function itv_user_columns_content($out, $column_name, $user_id){
       

    if($column_name == 'particip' && function_exists('get_field_object')){
        $part_obj = get_field_object('user_participation', 'user_'.$user_id);
        $value = (isset($part_obj['value'])) ? $part_obj['value'] : false;
        
        if(!is_array($value))
            $value = array('nopart');
        
      
        $labels = array();
        foreach($value as $v){
            if(isset($part_obj['choices'][$v]))
                $labels[] = $part_obj['choices'][$v];
        }
        
        $out = "<i>".implode(', ', $labels)."</i>";
    }
    
    return $out;
}

#	add task activity log on task edit page in admin panel
function itv_tasks_log_box_content(WP_Post $task) {
	$itv_log = ItvLog::instance();
	$log_records = $itv_log->get_task_log($task->ID);
	
	echo "<table>";
	
	echo "<tr class='itv-stats-header'>";
	echo "<th>".__("Activity time", 'tst')."</th>";
	echo "<th>".__("Status become", 'tst')."</th>";
	echo "<th>".__("Activity details", 'tst')."</th>";
	echo "</tr>";
	
	foreach ($log_records as $k => $log) {
		$user = $log->assoc_user_id ? get_user_by( 'id', $log->assoc_user_id ) : NULL;
		$user_text = '';
		if($user) {
			$user_text = "<a href='".get_edit_user_link( $user->ID )."'>" . $user->display_name . "</a>";
		}
		else {
			$user_text = __('Unknown user', 'tst');
		}
		
		echo "<tr>";
		echo "<td class='itv-stats-time'>".$log->action_time."</td>";
		echo "<td class='itv-stats-time'>".tst_get_task_status_label($log->task_status)."</td>";
		echo "<td>".$itv_log->humanize_action($log->action, $user_text)."</td>";
		echo "</tr>";
	}
	echo "</table>";
}

function itv_add_tasks_log_box() {
	add_meta_box( 'itv_task_actions_log', __( 'Task Changes Log', 'tst' ), 'itv_tasks_log_box_content', 'tasks' );
}
add_action( 'add_meta_boxes', 'itv_add_tasks_log_box' );


#	show tasks activity log on tasks log page 
function itv_all_tasks_log_box_content() {
	$itv_log = ItvLog::instance();
	
	$page = isset($_GET['pn']) ? (int)$_GET['pn'] : 0;
	if($page <= 0) {
		$page = 1;
	}
	
	$limit = 50;
	$offset = ($page - 1) * $limit;
	
	$log_records = $itv_log->get_all_tasks_log($offset, $limit);
	$all_records_count = $itv_log->get_all_tasks_log_records_count();
	
	$pn_args = array(
			'base'               => 'tools.php?page=itv_all_tasks_log_page%_%',
			'format'             => '&pn=%#%',
			'total'              => ceil($all_records_count / $limit),
			'current'            => $page,
			'show_all'           => TRUE,
			'end_size'           => 1,
			'mid_size'           => 2,
			'prev_next'          => True,
			'prev_text'          => __('« Previous', 'tst'),
			'next_text'          => __('Next »', 'tst'),
			'type'               => 'plain',
			'add_args'           => TRUE,
			'add_fragment'       => '',
			'before_page_number' => '',
			'after_page_number'  => ''
	);
	
	echo paginate_links( $pn_args ) . "<br /><br />";
	echo "<table>";
	
	echo "<tr class='itv-stats-header'>";
	echo "<th>".__("Log record title", 'tst')."</th>";
	echo "<th>".__("Activity time", 'tst')."</th>";
	echo "<th class='itv-stats-header-status'>".__("Status become", 'tst')."</th>";
	echo "<th>".__("Activity details", 'tst')."</th>";
	echo "<th></th>";
	echo "</tr>";
	
	foreach ($log_records as $k => $log) {
		if($itv_log->is_user_action($log->action)) {
			$user_id = $log->assoc_user_id;
			$user_login = $log->task_status;
			
			$user = $user_id ? get_user_by( 'id', $user_id ) : NULL;
			$user_link = $user ? tst_get_member_url($user) : get_edit_user_link( $user_id );
			$edit_user_link = get_edit_user_link( $user_id );
			
			$user_text = "<a href='".$user_link."' title='".get_user_last_login_time($user)."'>" . $user_login . "</a>";
			$user_text .= "<a href='".$edit_user_link."' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";;
				
			echo "<tr>";
			echo "<td class='itv-stats-task-title' title='".get_user_meta($user->ID, 'last_login_time', true)."'>".$itv_log->humanize_action($log->action, $user_text)."</td>";
			echo "<td class='itv-stats-time'>".$log->action_time."</td>";
			echo "<td class='itv-stats-time'>"."</td>";
			echo "<td>".$user_text."</td>";
			echo "<td>".$log->data."</td>";
			echo "</tr>";
		}
		else {
			$user = $log->assoc_user_id ? get_user_by( 'id', $log->assoc_user_id ) : NULL;
			$user_text = '';
			if($user) {
				$user_link = tst_get_member_url($user);
				$edit_user_link = get_edit_user_link( $user_id );
				$user_text = "<a href='".$user_link."'>" . $user->display_name . "</a>";
				$user_text .= "<a href='".$edit_user_link."' class='dashicons-before dashicons-edit itv-log-edit-user' > </a>";;
			}
			else {
				$user_text = __('Unknown user', 'tst');
			}
			
			$task = get_post($log->task_id);
			$task_text = '';
			if($task) {
				$task_text = "<a href='".get_post_permalink($task->ID)."' target='_blank'>" . $task->post_title . "</a>";
			}
			else {
				$task_text = __('Unknown task', 'tst');
			}
	
			echo "<tr>";
			echo "<td class='itv-stats-task-title'>".$task_text."</td>";
			echo "<td class='itv-stats-time'>".$log->action_time."</td>";
			echo "<td class='itv-stats-time'>".tst_get_task_status_label($log->task_status)."</td>";
			echo "<td>".$itv_log->humanize_action($log->action, $user_text)."</td>";
			echo "<td>".$log->data."</td>";
			echo "</tr>";
		}
	}
	echo "</table>";
	
	echo "<br />".paginate_links( $pn_args );
}


#	add tasks log page in admin panel
add_action('admin_menu', 'register_itv_tasks_log_submenu_page');
function register_itv_tasks_log_submenu_page() {
	add_submenu_page( 'tools.php', __('Itv General Log', 'tst'), __('Itv General Log', 'tst'), 'manage_options', 'itv_all_tasks_log_page', 'itv_tasks_log_page_callback' );
}

function itv_tasks_log_page_callback() {
	add_meta_box( 'itv_all_task_actions_log', __( 'All Tasks Changes Log', 'tst' ), 'itv_all_tasks_log_box_content', 'itv_all_tasks_log_page', 'normal' );
	
	echo '<div class="wrap"><div id="icon-tools" class="icon32"></div>';
	echo '<h2>' . __('Itv Tasks Log', 'tst') . '</h2>';
?>	
	<div id="poststuff">
		<div id="post-body" class="metabox-holder columns-2">
			<div id="post-body-content" style="position: relative;">
				<div id="postbox-container-2" class="postbox-container">
					<?php do_meta_boxes("itv_all_tasks_log_page", "normal", null); ?>
				</div>
			</div>
		</div>
	</div>
<?php 	
	echo '</div>';
}
