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
    }
    
    public function add_console_action_links( $actions, $user_object ) {
        $user_blocked_till = get_user_meta($user_object->ID, 'itv_blocked', true);

        $actions['itv_block_user'] = "<a class='thickbox itv-block-user-link' id='itv-block-user-link" . $user_object->ID . "' data-user-blocked-till='".$user_blocked_till."' data-user-nicename='" . $user_object->user_nicename . "' data-user-id='" . $user_object->ID . "' title='" . sprintf( __( 'Block user %s', 'tst' ), $user_object->user_nicename) . "' href='#TB_inline?title=qwe&width=600&height=150&inlineId=itv-block-user-modal'>" . __( 'Block user', 'tst' ) . "</a>";

        if($user_blocked_till) {
            $actions['itv_block_user'] .= "<span class='dashicons dashicons-lock itv-user-lock-icon' title='" . sprintf( __( 'User blocked till %s ', 'tst' ), $user_blocked_till ) . "'></span>";
        }

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
                <input type="button" value="<?php _e( 'Block user', 'tst' ) ?>" class="itv-user-block-submit"/>
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
        update_user_meta($user_id, 'itv_blocked', $block_till_date);

        wp_die( json_encode( array(
            'status' => 'ok',
            'user_id' => $user_id,
            'date' => $block_till_date,
        )));
    }
}

$user_block_model = UserBlockModel::instance();
$user_block_model->init_console();
