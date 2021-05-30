<?php
namespace ITV\models;

require_once 'ITVModel.php';

use \ITV\models\ITVSingletonModel;

class UserBlockModel extends ITVSingletonModel {
    protected static $_instance = null;
    
    public function __construct() {
        $itv_config = \ItvConfig::instance();
    }
    
    public function init_console() {
        add_action( 'admin_enqueue_scripts', array( $this, 'console_cssjs' ) );
        add_action( 'admin_footer', array( $this, 'get_console_footer_html' ) );
        add_filter( 'user_row_actions', array( $this, 'add_console_action_links' ), 10, 2 );
        add_action( 'wp_ajax_block_user', array( $this, 'ajax_block_user' ) );
        add_action( 'wp_ajax_unblock_user', array( $this, 'ajax_unblock_user' ) );
    }
    
    public function init_site() {
        add_action( 'init', array( $this, 'user_check_block' ) );
    }
    
    public function add_console_action_links( $actions, $user_object ) {
        $user_blocked_till = $this->get_user_block_till_date( $user_object->ID );
        
        $actions['itv_block_user'] = "<a class='thickbox itv-block-user-link' id='itv-block-user-link" . $user_object->ID . "' data-user-blocked-till='".$user_blocked_till."' data-user-nicename='" . $user_object->user_nicename . "' data-user-id='" . $user_object->ID . "' title='" . sprintf( __( 'Block user %s', 'tst' ), $user_object->user_nicename) . "' href='#TB_inline?width=600&height=180&inlineId=itv-block-user-modal'>" . __( 'Block user', 'tst' ) . "</a>";
        $actions['itv_block_user'] .= "<span class='dashicons dashicons-lock itv-user-lock-icon' style='" . ($user_blocked_till ? "" : "display:none;") . "' title='" . sprintf( __( 'User blocked till %s ', 'tst' ), ($user_blocked_till ? $user_blocked_till : '0000-00-00') ) . "'></span>";
        
        return $actions;
    }

    public function get_console_footer_html() {
?>
    <div id="itv-block-user-modal" style="display:none;">
        <div class="itv-block-user-wrapper" id="itv-block-user-form">

            <div class="itv-block-user-head">
                <span><?php _e( 'Blocking user ', 'tst' ) ?> </span>
                <b class="itv-block-user-nicename"></b>
            </div>

            <div class="itv-block-user-already-blocked">
            	<span class='dashicons dashicons-lock'></span> <?php _e( 'User blocked', 'tst' ) ?>
            </div>
            
            <select class="itv-block-user-period">
                <option value="1 week"><?php _e( 'Block user for 1 week', 'tst' ) ?></option>
                <option value="1 month"><?php _e( 'Block user for 1 months', 'tst' ) ?></option>
                <option value="3 month"><?php _e( 'Block user for 3 months', 'tst' ) ?></option>
                <option value="6 month"><?php _e( 'Block user for 6 months', 'tst' ) ?></option>
                <option value="1 year"><?php _e( 'Block user for 1 year', 'tst' ) ?></option>
                <option value="till_date"><?php _e( 'Block user till selected date', 'tst' ) ?></option>
            </select>
            <input type="date" name="block-till-date" value="" class="itv-user-block-till-date" />

            <div class="itv-block-user-actions">
                <input type="hidden" value="<?php echo wp_create_nonce( 'block-user' ); ?>" class="itv-user-block-nonce" />
                <input type="hidden" value="" class="itv-user-id" />
                <input type="button" value="<?php _e( 'Do block user', 'tst' ) ?>" class="itv-user-block-submit"/>
                <input type="button" value="<?php _e( 'Do unblock user', 'tst' ) ?>" class="itv-user-unblock-submit"/>
            </div>
        </div>
    </div>
<?php
    }

    public function console_cssjs() {
        add_thickbox();
    }

    public function ajax_block_user() {
        $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);

        if( empty( $_POST['nonce'] ) || !wp_verify_nonce( $_POST['nonce'], 'block-user' ) ) {
            wp_die( json_encode( array(
                'status' => 'error',
                'message' => __( 'Error: wrong data given.', 'tst' ),
            )));
        }

        $user_id = $_POST['user_id'];
        $block_till_date = $_POST['date'];
        $this->block_user( $user_id, $block_till_date );

        wp_die( json_encode( array(
            'status' => 'ok',
            'user_id' => $user_id,
            'date' => $block_till_date,
        )));
    }
    
    public function ajax_unblock_user() {
        $_POST['nonce'] = empty($_POST['nonce']) ? '' : trim($_POST['nonce']);
    
        if( empty( $_POST['nonce'] ) || !wp_verify_nonce( $_POST['nonce'], 'block-user' ) ) {
            wp_die( json_encode( array(
                            'status' => 'error',
                            'message' => __( 'Error: wrong data given.', 'tst' ),
            )));
        }
    
        $user_id = $_POST['user_id'];
        $block_till_date = $_POST['date'];
        $this->unblock_user( $user_id );
    
        wp_die( json_encode( array(
                        'status' => 'ok',
                        'user_id' => $user_id,
        )));
    }
    
    public function is_user_blocked( $user_id ) {
        return $this->get_user_block_till_date( $user_id ) ? true : false;
    }
    
    public function get_user_block_till_date( $user_id ) {
        return get_user_meta( $user_id, 'itv_blocked', true );
    }
    
    public function block_user( $user_id, $block_till_date ) {
        update_user_meta( $user_id, 'itv_blocked', $block_till_date );
        $this->email_block( $user_id, $block_till_date );
    }
    
    public function unblock_user( $user_id ) {
        delete_user_meta( $user_id, 'itv_blocked' );
        $this->email_unblock( $user_id );
    }
    
    public function email_block( $user_id, $block_till_date ) {
        
        $user = get_user_by ( 'id', $user_id );
        $about_block_page = get_page_by_path( 'conditions' );
        
        itv_notify_user( $user, \ItvEmailTemplates::$YOU_HAVE_BEEN_BLOCKED, array (
            'username' => $user->user_nicename,
            'user_first_name' => $user->first_name,
            'block_till_date' => date_i18n( get_option( 'date_format' ), strtotime( $block_till_date ) ),
            'block_info_url' => get_permalink( $about_block_page ),
            'block_reason' => '',
        ));
        
    }
    
    public function email_unblock( $user_id ) {

        $user = get_user_by ( 'id', $user_id );
        $about_block_page = get_page_by_path( 'conditions' );
        
        itv_notify_user( $user, \ItvEmailTemplates::$YOU_HAVE_BEEN_UNBLOCKED, array (
            'username' => $user->user_nicename,
            'user_first_name' => $user->first_name,
            'block_info_url' => get_permalink( $about_block_page ),
            'task_list_url' => home_url( '/tasks' ),
        ));
        
    }
    
    public function user_check_block() {
        $user_id = get_current_user_id();
        
        if( $this->is_user_blocked( $user_id ) ) {
            wp_logout();
            wp_redirect( home_url() );
            exit();
        }
    }
    
    public function unblock_users_when_block_expired( $wpdb ) {
        $sql = "SELECT * FROM {$wpdb->prefix}usermeta WHERE meta_key = %s AND meta_value < %s";
        $users_to_unblock = $wpdb->get_results( $wpdb->prepare( $sql, 'itv_blocked', date('Y-m-d') ) );
        foreach( $users_to_unblock as $user_meta ) {
            try {
                echo sprintf( "User to unblock %d, blocked till %s\n", $user_meta->user_id, $user_meta->meta_value );
                $this->unblock_user( $user_meta->user_id );
                echo "unblocked ok\n";
            }
            catch (\Exception $ex) {
                echo $ex->getMessage() . "\n";
            }
        }
    }
}

if ( defined('ABSPATH') ) {
    $user_block_model = UserBlockModel::instance();
    if( is_admin() ) {
        $user_block_model->init_console();
    }
    else {
        $user_block_model->init_site();
    }
}
