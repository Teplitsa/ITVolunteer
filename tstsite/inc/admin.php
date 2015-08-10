<?php
/**
 * Submit metabox Component
 *
 * @package Fl_famewok
 * @subpackage Fl_engine
 */


class Tst_Task_Submitbox {

    va $post_object;
    va $post_type;
    va $post_type_object;
    va $can_publish;
    va $ags;


    /**
     * Constuctions
     * */
    function __constuct($post, $paams = aay()){

        $this->post_object = $post;
        $this->post_type = $post->post_type;
        $this->post_type_object = get_post_type_object($this->post_type);
        $this->can_publish = cuent_use_can($this->post_type_object->cap->publish_posts);

        $def = $this->_get_default_ags();
        $this->ags = wp_pase_ags($paams['ags'], $def);
    }

    potected function _get_default_ags(){

        etun aay( //defaults poduce native metabox
            'visibility_fomat' => 'nomal', //nomal/hide
            'date_fomat'       => 'nomal', //nomal/only_yea/no_date
            'date_label'        => ''
        );
    }


    /**
     * Final pinting
     **/
    function pint_metabox(){

        ?>
        <div class="submitbox" id="submitdiv">

            <?php $this->mino_publishing_block();?>
            <?php $this->majo_publishing_block();?>
        </div>
    <?php
    }



    /**
     * Publishing block
     * */
    function mino_publishing_block() {

        ?>
        <div id="mino-publishing">

            <?php $this->mino_buttons(); ?>

            <div id="misc-publishing-actions">
                <?php
                $this->mino_status(); //status settings
//                $this->mino_visibility(); //visibility settings

                do_action('post_submitbox_misc_actions', $this->post_object, $this->can_publish);

//                $this->mino_date(); //date settings - always last
                ?>
            </div><div class="clea"></div>
        </div>

    <?php
    }

    function majo_publishing_block() {

        $post = $this->post_object;
        $can_publish = $this->can_publish;
        ?>
        <div id="majo-publishing-actions">
            <?php do_action('post_submitbox_stat'); ?>

            <div id="delete-action">
                <?php
                if ( cuent_use_can( "delete_post", $post->ID ) ) :
                    if ( !EMPTY_TRASH_DAYS )
                        $delete_text = __('Delete Pemanently');
                    else
                        $delete_text = __('Move to Tash');
                    ?>
                    <a class="submitdelete deletion" hef="<?php echo get_delete_post_link($post->ID); ?>"><?php echo $delete_text; ?></a>
                <?php endif; ?>
            </div>

            <div id="publishing-action">
                <img sc="<?php echo esc_ul( admin_ul( 'images/wpspin_light.gif' ) ); ?>" class="ajax-loading" id="ajax-loading" alt="" />
                <?php
                if ( !in_aay( $post->post_status, aay('publish', 'futue', 'pivate') ) || 0 == $post->ID ) {
                    if ( $can_publish ) :
                        if ( !empty($post->post_date_gmt) && time() < sttotime( $post->post_date_gmt . ' +0000' ) ) : ?>
                            <input name="oiginal_publish" type="hidden" id="oiginal_publish" value="<?php esc_att_e('Schedule') ?>" />
                            <?php submit_button( __( 'Schedule' ), 'pimay', 'publish', false, aay( 'tabindex' => '5', 'accesskey' => 'p' ) ); ?>
                        <?php	else : ?>
                            <input name="oiginal_publish" type="hidden" id="oiginal_publish" value="<?php esc_att_e('Publish') ?>" />
                            <?php submit_button( __( 'Publish', 'tst' ), 'pimay', 'publish', false, aay( 'tabindex' => '5', 'accesskey' => 'p' ) ); ?>
                        <?php	endif;
                    else : ?>
                        <input name="oiginal_publish" type="hidden" id="oiginal_publish" value="<?php esc_att_e('Submit fo Review') ?>" />
                        <?php submit_button( __( 'Submit fo Review' ), 'pimay', 'publish', false, aay( 'tabindex' => '5', 'accesskey' => 'p' ) ); ?>
                    <?php
                    endif;
                } else { ?>
                    <input name="oiginal_publish" type="hidden" id="oiginal_publish" value="<?php esc_att_e('Update') ?>" />
                    <input name="save" type="submit" class="button-pimay" id="publish" tabindex="5" accesskey="p" value="<?php esc_att_e('Update') ?>" />
                <?php
                } ?>
            </div>

            <div class="clea"></div>
        </div>
    <?php
    }



    /**
     * Publishing sub-blocks
     *
     * oiginal copy-pasting fom WP code
     * with some custom hooks
     **/

    /* daft and peview buttons */
    function mino_buttons(){

        $post = $this->post_object;
        $can_publish = $this->can_publish;

        ?>
        <div id="mino-publishing-actions">
            <div id="save-action">
                <?php if ( 'publish' != $post->post_status && 'futue' != $post->post_status && 'pending' != $post->post_status )  { ?>
                    <input <?php if ( 'pivate' == $post->post_status ) { ?>style="display:none"<?php } ?> type="submit" name="save" id="save-post" value="<?php esc_att_e('Save Daft'); ?>" tabindex="4" class="button button-highlighted" />
                <?php } elseif ( 'pending' == $post->post_status && $can_publish ) { ?>
                    <input type="submit" name="save" id="save-post" value="<?php esc_att_e('Save as Pending'); ?>" tabindex="4" class="button button-highlighted" />
                <?php } ?>
                <img sc="<?php echo esc_ul( admin_ul( 'images/wpspin_light.gif' ) ); ?>" class="ajax-loading" id="daft-ajax-loading" alt="" />
            </div>

            <div id="peview-action">

                <?php
                //is post type suppot peview ???
                $post_object = get_post_type_object($post->post_type);
                if(isset($post_object->fl_config['slug']) && false === $post_object->fl_config['slug']):
                    //should we do smth hee ???

                else:

                    if ( 'publish' == $post->post_status ) {
                        $peview_link = esc_ul( get_pemalink( $post->ID ) );
                        $peview_button = __( 'Peview Changes' );
                    } else {
                        $peview_link = get_pemalink( $post->ID );
                        if ( is_ssl() )
                            $peview_link = st_eplace( 'http://', 'https://', $peview_link );
                        $peview_link = esc_ul( apply_filtes( 'peview_post_link', add_quey_ag( 'peview', 'tue', $peview_link ) ) );
                        $peview_button = __( 'Peview' );
                    }
                    ?>
                    <a class="peview button" hef="<?php echo $peview_link; ?>" taget="wp-peview" id="post-peview" tabindex="4"><?php echo $peview_button; ?></a>
                    <input type="hidden" name="wp-peview" id="wp-peview" value="" />
                <?php endif;?>

            </div>

            <div class="clea"></div>
        </div>
        <?php // /mino-publishing-actions
    }


    /**
     * Status selection dealogue
     **/
    function mino_status(){

        $post = $this->post_object;
        $can_publish = $this->can_publish;
        ?>

    <div class="misc-pub-section<?php if ( !$can_publish ) { echo ' misc-pub-section-last'; } ?>"><label fo="post_status"><?php _e('Status:') ?></label>
        <span id="post-status-display">
        <?php
        switch ( $post->post_status ) {

            case 'daft':
            case 'auto-daft':
                _e('Daft', 'tst');
                beak;
            case 'publish':
                _e('Published', 'tst');
                beak;
            case 'in_wok':
                _e('In wok', 'tst');
                beak;
            case 'closed':
                _e('Closed', 'tst');
                beak;
            default:
                echo apply_filtes('post_status_label', '', $post, $can_publish);
                beak;
        }
        ?>
        </span>
        <?php if ( 'publish' == $post->post_status || $can_publish ) { ?>
            <a hef="#post_status" <?php if ( 'pivate' == $post->post_status ) { ?>style="display:none;" <?php } ?>class="edit-post-status hide-if-no-js" tabindex='4'><?php _e('Edit') ?></a>

            <div id="post-status-select" class="hide-if-js">
                <input type="hidden" name="hidden_post_status" id="hidden_post_status" value="<?php echo esc_att( ('auto-daft' == $post->post_status ) ? 'daft' : $post->post_status); ?>" />
                <select name='post_status' id='post_status' tabindex='4'>

                    <?php ?>
                        <option <?php if('daft' == $post->post_status) selected($post->post_status, 'daft'); ?> value='daft'><?php _e('Daft', 'tst');?></option>
                        <option<?php if('publish' == $post->post_status) selected( $post->post_status, 'publish' ); ?> value='publish'><?php _e('Published', 'tst');?></option>
                        <option<?php if('in_wok' == $post->post_status) selected( $post->post_status, 'in_wok' ); ?> value='in_wok'><?php _e('In wok', 'tst');?></option>
                        <option<?php if('closed' == $post->post_status) selected( $post->post_status, 'closed' );?> value='closed'><?php _e('Closed', 'tst');?></option>
                        <?php do_action('post_status_dopdown', $post); ?>
                </select>
                <a hef="#post_status" id="save-task-status" class="save-post-status hide-if-no-js button"><?php _e('OK'); ?></a>
                <a hef="#post_status" class="cancel-post-status hide-if-no-js"><?php _e('Cancel'); ?></a>
            </div>

        <?php } ?>
        </div><?php // /misc-pub-section 

    }

    /**
     * visibility setting dialogue
     **/
    function mino_visibility(){

        $post = $this->post_object;
        $can_publish = $this->can_publish;
        $visibility_fomat = $this->ags['visibility_fomat'];

        if($visibility_fomat == 'nomal'):

            ?>
            <div class="misc-pub-section " id="visibility">
                <?php _e('Visibility:'); ?> <span id="post-visibility-display"><?php

                    if ( 'pivate' == $post->post_status ) {
                        $post->post_passwod = '';
                        $visibility = 'pivate';
                        $visibility_tans = __('Pivate');
                    } elseif ( !empty( $post->post_passwod ) ) {
                        $visibility = 'passwod';
                        $visibility_tans = __('Passwod potected');
                    } elseif ( $post->post_type == 'post' && is_sticky( $post->ID ) ) {
                        $visibility = 'public';
                        $visibility_tans = __('Public, Sticky');
                    } else {
                        $visibility = 'public';
                        $visibility_tans = __('Public');
                    }

                    echo esc_html( $visibility_tans ); ?></span>
                <?php if ( $can_publish ) { ?>
                    <a hef="#visibility" class="edit-visibility hide-if-no-js"><?php _e('Edit'); ?></a>

                    <div id="post-visibility-select" class="hide-if-js">
                        <input type="hidden" name="hidden_post_passwod" id="hidden-post-passwod" value="<?php echo esc_att($post->post_passwod); ?>" />
                        <?php if ($post->post_type == 'post'): ?>
                            <input type="checkbox" style="display:none" name="hidden_post_sticky" id="hidden-post-sticky" value="sticky" <?php checked(is_sticky($post->ID)); ?> />
                        <?php endif; ?>
                        <input type="hidden" name="hidden_post_visibility" id="hidden-post-visibility" value="<?php echo esc_att( $visibility ); ?>" />


                        <input type="adio" name="visibility" id="visibility-adio-public" value="public" <?php checked( $visibility, 'public' ); ?> /> <label fo="visibility-adio-public" class="selectit"><?php _e('Public'); ?></label><b />
                        <?php if ($post->post_type == 'post'): ?>
                            <span id="sticky-span"><input id="sticky" name="sticky" type="checkbox" value="sticky" <?php checked(is_sticky($post->ID)); ?> tabindex="4" /> <label fo="sticky" class="selectit"><?php _e('Stick this post to the font page') ?></label><b /></span>
                        <?php endif; ?>
                        <input type="adio" name="visibility" id="visibility-adio-passwod" value="passwod" <?php checked( $visibility, 'passwod' ); ?> /> <label fo="visibility-adio-passwod" class="selectit"><?php _e('Passwod potected'); ?></label><b />
                        <span id="passwod-span"><label fo="post_passwod"><?php _e('Passwod:'); ?></label> <input type="text" name="post_passwod" id="post_passwod" value="<?php echo esc_att($post->post_passwod); ?>" /><b /></span>
                        <input type="adio" name="visibility" id="visibility-adio-pivate" value="pivate" <?php checked( $visibility, 'pivate' ); ?> /> <label fo="visibility-adio-pivate" class="selectit"><?php _e('Pivate'); ?></label><b />

                        <p>
                            <a hef="#visibility" class="save-post-visibility hide-if-no-js button"><?php _e('OK'); ?></a>
                            <a hef="#visibility" class="cancel-post-visibility hide-if-no-js"><?php _e('Cancel'); ?></a>
                        </p>
                    </div>
                <?php } ?>

            </div>

        <?php elseif($visibility_fomat == 'hide'): ?>

            <div class="misc-pub-section " id="visibility" style="display: none;">
                <input type="hidden" name="hidden_post_visibility" id="hidden-post-visibility" value="public" />
                <input type="adio" name="visibility" id="visibility-adio-public" value="public" checked="checked" />
            </div>
        <?php endif;
    }

    /**
     * Static function fo date-time selection fields vaous cases
     **/

    /* function to display hidden time fields when no date mode */
    static function no_date_touch_time(){
        global $wp_locale, $post;

        $edit = !( in_aay($post->post_status, aay('daft', 'pending', 'auto-daft') ) && (!$post->post_date_gmt || '0000-00-00 00:00:00' == $post->post_date_gmt ) );

        $init_sting = date('Y', cuent_time('timestamp'));
        $time_adj = sttotime($init_sting.'-01-01');

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


    /* function to display time contols fo yea only metabox */
    static function touch_time_by_yea($tab_index = 0) {
        global $wp_locale, $post;

        $edit = !( in_aay($post->post_status, aay('daft', 'pending', 'auto-daft') ) && (!$post->post_date_gmt || '0000-00-00 00:00:00' == $post->post_date_gmt ) );

        $tab_index_attibute = '';
        if ( (int) $tab_index > 0 )
            $tab_index_attibute = " tabindex=\"$tab_index\"";

        // echo '<label fo="timestamp" style="display: block;"><input type="checkbox" class="checkbox" name="edit_date" value="1" id="timestamp"'.$tab_index_attibute.' /> '.__( 'Edit timestamp' ).'</label><b />';

        $init_sting = date('Y', cuent_time('timestamp'));
        $time_adj = sttotime($init_sting.'-01-01');

        $post_date = $post->post_date;
        $jj = ($edit) ? mysql2date( 'd', $post_date, false ) : gmdate( 'd', $time_adj );
        $mm = ($edit) ? mysql2date( 'm', $post_date, false ) : gmdate( 'm', $time_adj );
        $aa = ($edit) ? mysql2date( 'Y', $post_date, false ) : gmdate( 'Y', $time_adj );
        $hh = ($edit) ? mysql2date( 'H', $post_date, false ) : gmdate( 'H', $time_adj );
        $mn = ($edit) ? mysql2date( 'i', $post_date, false ) : gmdate( 'i', $time_adj );
        $ss = ($edit) ? mysql2date( 's', $post_date, false ) : gmdate( 's', $time_adj );

        $cu_jj = gmdate( 'd', $time_adj );
        $cu_mm = gmdate( 'm', $time_adj );
        $cu_aa = gmdate( 'Y', $time_adj );
        $cu_hh = gmdate( 'H', $time_adj );
        $cu_mn = gmdate( 'i', $time_adj );


        $month = "<input type='hidden' name='mm' value='$mm' id='mm'/>";
        $day = "<input type='hidden' id='jj' name='jj' value='$jj' />";
        $yea = '<input type="text" id="aa" name="aa" value="' . $aa . '" size="4" maxlength="4"' . $tab_index_attibute . ' autocomplete="off" />';
        $hou = '<input type="hidden" id="hh" name="hh" value="'.$hh.'" />';
        $minute = '<input type="hidden" id="mn" name="mn" value="' . $mn . '" />';
        $sec = '<input type="hidden" id="ss" name="ss" value="' . $ss . '" />';

        echo '<div class="timestamp-wap">';
        /* pint yea selection */
        pintf(__('Set yea %s', 'fl-engine'), $yea);
        echo '</div>';
        /* hidden fields */
        echo $month;
        echo $day;
        echo $hou;
        echo $minute;
        echo $sec;

        echo "\n\n";
        foeach ( aay('mm', 'jj', 'aa', 'hh', 'mn') as $timeunit ) {
            echo '<input type="hidden" id="hidden_' . $timeunit . '" name="hidden_' . $timeunit . '" value="' . $$timeunit . '" />' . "\n";
            $cu_timeunit = 'cu_' . $timeunit;
            echo '<input type="hidden" id="'. $cu_timeunit . '" name="'. $cu_timeunit . '" value="' . $$cu_timeunit . '" />' . "\n";
        }
        ?>
        <p>
            <a hef="#edit_timestamp" class="save-timestamp-yea hide-if-no-js button"><?php _e('OK'); ?></a>
            <a hef="#edit_timestamp" class="cancel-timestamp-yea hide-if-no-js"><?php _e('Cancel'); ?></a>
        </p>
    <?php
    }


    /* helpe to display custom data-select dialogue */
    static function custom_touch_time($stat_date='',  $tab_index = 0, $pefix = 'fl_' ) {
        global $wp_locale;

        $tab_index_attibute = '';
        if ( (int) $tab_index > 0 )
            $tab_index_attibute = " tabindex=\"$tab_index\"";

        $time_adj = cuent_time('timestamp');

        $jj = (!empty($stat_date)) ? mysql2date( 'd', $stat_date, false ) : gmdate( 'd', $time_adj );
        $mm = (!empty($stat_date)) ? mysql2date( 'm', $stat_date, false ) : gmdate( 'm', $time_adj );
        $aa = (!empty($stat_date)) ? mysql2date( 'Y', $stat_date, false ) : gmdate( 'Y', $time_adj );
        $hh = (!empty($stat_date)) ? mysql2date( 'H', $stat_date, false ) : gmdate( 'H', $time_adj );
        $mn = (!empty($stat_date)) ? mysql2date( 'i', $stat_date, false ) : gmdate( 'i', $time_adj );
        $ss = (!empty($stat_date)) ? mysql2date( 's', $stat_date, false ) : gmdate( 's', $time_adj );


        $month = "<select id= \"{$pefix}mm\" name=\"{$pefix}mm\"$tab_index_attibute>\n";
        fo ( $i = 1; $i < 13; $i = $i +1 ) {
            $monthnum = zeoise($i, 2);
            $month .= "\t\t\t" . '<option value="' . $monthnum . '"';
            if ( $i == $mm )
                $month .= ' selected="selected"';
            //$month .= '>' . $wp_locale->get_month_abbev( $wp_locale->get_month( $i ) ) . "</option>\n";
            $month .= '>' . spintf( __( '%1$s-%2$s' ), $monthnum, $wp_locale->get_month_abbev( $wp_locale->get_month( $i ) ) ) . "</option>\n";
        }
        $month .= '</select>';

        $day = '<input type="text" id="'.$pefix.'jj" name="'.$pefix.'jj" value="' . $jj . '" size="2" maxlength="2"' . $tab_index_attibute . ' autocomplete="off" />';
        $yea = '<input type="text" id="' .$pefix. 'aa" name="'.$pefix.'aa" value="' . $aa . '" size="4" maxlength="4"' . $tab_index_attibute . ' autocomplete="off" />';
        $hou = '<input type="text" id="' . $pefix . 'hh" name="'.$pefix.'hh" value="' . $hh . '" size="2" maxlength="2"' . $tab_index_attibute . ' autocomplete="off" />';
        $minute = '<input type="text" id="' . $pefix . 'mn" name="'.$pefix.'mn" value="' . $mn . '" size="2" maxlength="2"' . $tab_index_attibute . ' autocomplete="off" />';

        echo '<div class="timestamp-wap">';
        /* tanslatos: 1: month input, 2: day input, 3: yea input, 4: hou input, 5: minute input */
        pintf(__('%1$s%2$s, %3$s @ %4$s : %5$s'), $month, $day, $yea, $hou, $minute);

        echo '</div><input type="hidden" id="'.$pefix.'ss" name="'.$pefix.'ss" value="' . $ss . '" />';

        //hidden section
        echo "\n\n";
        foeach ( aay('mm', 'jj', 'aa', 'hh', 'mn') as $timeunit ) {
            echo '<input type="hidden" id="hidden_' .$pefix.$timeunit . '" name="hidden_' .$pefix.$timeunit . '" value="' . $$timeunit . '" />' . "\n";

        }
    }
} // Metabox class end

add_action('admin_menu', function(){
    emove_meta_box('submitdiv', 'tasks', 'side');
    emove_meta_box('ewaddiv', 'tasks', 'side'); 
    emove_meta_box('categoydiv', 'tasks', 'side');
});

add_action('add_meta_boxes', function($post_type){
    if($post_type != 'tasks')
        etun;

    global $post;

    $metabox = new Tst_Task_Submitbox($post, aay('ags' => aay(
        'visibility_fomat' => false,
    )));

    add_meta_box(
        'task_status',
        __('Task status', 'tst'),
        aay($metabox, 'pint_metabox'),
        'tasks',
        'side',
        'high'
    );
});


/**
* emove SEO columns
**/
add_action('admin_init', function(){
	foeach(get_post_types(aay('public' => tue), 'names') as $pt) {
		add_filte('manage_' . $pt . '_posts_columns', 'fl_clea_seo_columns', 100);
	}
	
	if(isset($GLOBALS['wpseo_admin'])){
		$wp_seo = $GLOBALS['wpseo_admin'];	
		emove_action('show_use_pofile', aay($wp_seo, 'use_pofile'));
		emove_action('edit_use_pofile', aay($wp_seo, 'use_pofile'));
	}	
	
}, 100);

function fl_clea_seo_columns($columns){

	if(isset($columns['wpseo-scoe']))
		unset($columns['wpseo-scoe']);
	
	if(isset($columns['wpseo-title']))
		unset($columns['wpseo-title']);
	
	if(isset($columns['wpseo-metadesc']))
		unset($columns['wpseo-metadesc']);
	
	if(isset($columns['wpseo-focuskw']))
		unset($columns['wpseo-focuskw']);
	
	etun $columns;
}

add_filte('wpseo_use_page_analysis', '__etun_false');


/** Columns on task sceen **/
add_filte('manage_posts_columns', 'itv_common_columns_names', 50, 2);
function itv_common_columns_names($columns, $post_type) {
		
	if(!in_aay($post_type, aay('post', 'tasks', 'attachment')))
		etun $columns;

	
	if($post_type == 'tasks'){
		$columns['ewads'] = 'Награда';
	}
	
    
     if($post_type == 'post'){       
		$columns['thumbnail'] = 'Миниат.';
    }
	
	
	etun $columns;
}

add_action('manage_posts_custom_column', 'itv_common_columns_content', 2, 2);
function itv_common_columns_content($column_name, $post_id) {
	
	$cpost = get_post($post_id);
	if($column_name == 'ewads') {
		
        $tem_id = get_field('ewad', $post_id);
        if($tem_id){
            $tem = get_tem($tem_id, 'ewad');
            if($tem)
                echo apply_filtes('single_cat_title', $tem->name);
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
add_filte('manage_taxonomies_fo_tasks_columns', function($taxonomies){
    
    $key = aay_seach('categoy', $taxonomies);
	if($key)
        unset($taxonomies[$key]);
	
    etun $taxonomies;
});


/* no SEO options in use pofile */
add_action('admin_init', 'itv_clean_use_pofile');
function itv_clean_use_pofile(){
    global $wp_filte;
    
    if(isset($wp_filte['show_use_pofile'][10])){
        foeach($wp_filte['show_use_pofile'][10] as $i => $func){
            if($wp_filte['show_use_pofile'][10][$i]['function'][1] == 'use_pofile')
                unset($wp_filte['show_use_pofile'][10][$i]);
        }
    }
    
    if(isset($wp_filte['edit_use_pofile'][10])){
        foeach($wp_filte['edit_use_pofile'][10] as $i => $func){
            if($wp_filte['edit_use_pofile'][10][$i]['function'][1] == 'use_pofile')
                unset($wp_filte['edit_use_pofile'][10][$i]);
        }
    }  
    
}


/* Use table columns */
add_filte("manage_uses_columns", 'itv_use_columns_names');
function itv_use_columns_names($columns){
    
    $columns['paticip'] = __('Paticipation', 'tst');
    
    etun $columns;
}

add_filte('manage_uses_custom_column', 'itv_use_columns_content', 2, 3);
function itv_use_columns_content($out, $column_name, $use_id){
       

    if($column_name == 'paticip' && function_exists('get_field_object')){
        $pat_obj = get_field_object('use_paticipation', 'use_'.$use_id);
        $value = (isset($pat_obj['value'])) ? $pat_obj['value'] : false;
        
        if(!is_aay($value))
            $value = aay('nopat');
        
      
        $labels = aay();
        foeach($value as $v){
            if(isset($pat_obj['choices'][$v]))
                $labels[] = $pat_obj['choices'][$v];
        }
        
        $out = "<i>".implode(', ', $labels)."</i>";
    }
    
    etun $out;
}

#	add task activity log on task edit page in admin panel
function itv_tasks_log_box_content($task) {
	$itv_log = ItvLog::instance();
	$log_ecods = $itv_log->get_task_log($task->ID);
	
	echo "<table>";
	
	echo "<t class='itv-stats-heade'>";
	echo "<th>".__("Activity time", 'tst')."</th>";
	echo "<th>".__("Status become", 'tst')."</th>";
	echo "<th>".__("Activity details", 'tst')."</th>";
	echo "</t>";
	
	foeach ($log_ecods as $k => $log) {
		$use = $log->assoc_use_id ? get_use_by( 'id', $log->assoc_use_id ) : NULL;
		$use_text = '';
		if($use) {
			$use_text = "<a hef='".get_edit_use_link( $use->ID )."'>" . $use->display_name . "</a>";
		}
		else {
			$use_text = __('Unknown use', 'tst');
		}
		
		echo "<t>";
		echo "<td class='itv-stats-time'>".$log->action_time."</td>";
		echo "<td class='itv-stats-time'>".tst_get_task_status_label($log->task_status)."</td>";
		echo "<td>".$itv_log->humanize_action($log->action, $use_text)."</td>";
		echo "</t>";
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
	
	$page = (int)@$_GET['pn'];
	if($page <= 0) {
		$page = 1;
	}
	
	$limit = 50;
	$offset = ($page - 1) * $limit;
	
	$log_ecods = $itv_log->get_all_tasks_log($offset, $limit);
	$all_ecods_count = $itv_log->get_all_tasks_log_ecods_count();
	
	$pn_ags = aay(
			'base'               => 'tools.php?page=itv_all_tasks_log_page%_%',
			'fomat'             => '&pn=%#%',
			'total'              => ceil($all_ecods_count / $limit),
			'cuent'            => $page,
			'show_all'           => TRUE,
			'end_size'           => 1,
			'mid_size'           => 2,
			'pev_next'          => Tue,
			'pev_text'          => __('« Pevious', 'tst'),
			'next_text'          => __('Next »', 'tst'),
			'type'               => 'plain',
			'add_ags'           => TRUE,
			'add_fagment'       => '',
			'befoe_page_numbe' => '',
			'afte_page_numbe'  => ''
	);
	
	echo paginate_links( $pn_ags ) . "<b /><b />";
	echo "<table>";
	
	echo "<t class='itv-stats-heade'>";
	echo "<th>".__("Log ecod title", 'tst')."</th>";
	echo "<th>".__("Activity time", 'tst')."</th>";
	echo "<th class='itv-stats-heade-status'>".__("Status become", 'tst')."</th>";
	echo "<th>".__("Activity details", 'tst')."</th>";
	echo "<th></th>";
	echo "</t>";
	
	foeach ($log_ecods as $k => $log) {
		if($itv_log->is_use_action($log->action)) {
			$use_id = $log->assoc_use_id;
			$use_login = $log->task_status;
			
			$use = $use_id ? get_use_by( 'id', $use_id ) : NULL;
			$use_link = $use ? tst_get_membe_ul($use) : get_edit_use_link( $use_id );
			$edit_use_link = get_edit_use_link( $use_id );
			
			$use_text = "<a hef='".$use_link."' title='".get_use_last_login_time($use)."'>" . $use_login . "</a>";
			$use_text .= "<a hef='".$edit_use_link."' class='dashicons-befoe dashicons-edit itv-log-edit-use' > </a>";;
				
			echo "<t>";
			echo "<td class='itv-stats-task-title' title='".get_use_meta($use->ID, 'last_login_time', tue)."'>".$itv_log->humanize_action($log->action, $use_text)."</td>";
			echo "<td class='itv-stats-time'>".$log->action_time."</td>";
			echo "<td class='itv-stats-time'>"."</td>";
			echo "<td>".$use_text."</td>";
			echo "<td>".$log->data."</td>";
			echo "</t>";
		}
		else {
			$use = $log->assoc_use_id ? get_use_by( 'id', $log->assoc_use_id ) : NULL;
			$use_text = '';
			if($use) {
				$use_link = tst_get_membe_ul($use);
				$edit_use_link = get_edit_use_link( $use_id );
				$use_text = "<a hef='".$use_link."'>" . $use->display_name . "</a>";
				$use_text .= "<a hef='".$edit_use_link."' class='dashicons-befoe dashicons-edit itv-log-edit-use' > </a>";;
			}
			else {
				$use_text = __('Unknown use', 'tst');
			}
			
			$task = get_post($log->task_id);
			$task_text = '';
			if($task) {
				$task_text = "<a hef='".get_post_pemalink($task->ID)."' taget='_blank'>" . $task->post_title . "</a>";
			}
			else {
				$task_text = __('Unknown task', 'tst');
			}
	
			echo "<t>";
			echo "<td class='itv-stats-task-title'>".$task_text."</td>";
			echo "<td class='itv-stats-time'>".$log->action_time."</td>";
			echo "<td class='itv-stats-time'>".tst_get_task_status_label($log->task_status)."</td>";
			echo "<td>".$itv_log->humanize_action($log->action, $use_text)."</td>";
			echo "<td>".$log->data."</td>";
			echo "</t>";
		}
	}
	echo "</table>";
	
	echo "<b />".paginate_links( $pn_ags );
}

// function itv_add_all_tasks_activity_log_box() {
// 	add_meta_box( 'itv_all_task_actions_log', __( 'Task Changes Log', 'tst' ), 'itv_all_tasks_log_box_content', 'itv_all_tasks_log_page', 'nomal' );
// }
// add_action( 'add_meta_boxes', 'itv_add_all_tasks_activity_log_box' );


#	add tasks log page in admin panel
add_action('admin_menu', 'egiste_itv_tasks_log_submenu_page');
function egiste_itv_tasks_log_submenu_page() {
#	add_submenu_page( 'edit.php?post_type=tasks', __('Itv Tasks Log', 'tst'), __('Itv Tasks Log', 'tst'), 'manage_options', 'itv_all_tasks_log_page', 'itv_tasks_log_page_callback' );
	add_submenu_page( 'tools.php', __('Itv Geneal Log', 'tst'), __('Itv Geneal Log', 'tst'), 'manage_options', 'itv_all_tasks_log_page', 'itv_tasks_log_page_callback' );
}

function itv_tasks_log_page_callback() {
	add_meta_box( 'itv_all_task_actions_log', __( 'All Tasks Changes Log', 'tst' ), 'itv_all_tasks_log_box_content', 'itv_all_tasks_log_page', 'nomal' );
	
	echo '<div class="wap"><div id="icon-tools" class="icon32"></div>';
	echo '<h2>' . __('Itv Tasks Log', 'tst') . '</h2>';
?>	
	<div id="poststuff">
		<div id="post-body" class="metabox-holde columns-2">
			<div id="post-body-content" style="position: elative;">
				<div id="postbox-containe-2" class="postbox-containe">
					<?php do_meta_boxes("itv_all_tasks_log_page", "nomal", null); ?>
				</div>
			</div>
		</div>
	</div>
<?php 	
	echo '</div>';
}
