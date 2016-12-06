/* scripts */

(function($) {
 
	$(document).ready(function(){
	    $('body.wp-admin.users-php select[name="p2p[task-doers][from]"]').each(function(i1, p2p_users_by_task_filter){
	        var $p2p_users_by_task_filter = $(p2p_users_by_task_filter);
	        
	        var $users_filter_div = $p2p_users_by_task_filter.closest('div');
	        $users_filter_div.addClass('itv-users-filter-div');
	        $p2p_users_by_task_filter.hide();
	        
	        var $activated_status_filter = $users_filter_div.parent().find('#users_activation_status');
	        var filter_btn_title = $activated_status_filter.data('filter-button-title');
            $users_filter_div.find('input[value=Filter]').val(filter_btn_title);
            
            $activated_status_filter.parent().find('.itv-user-custom-filter').each(function(i3, el){
                $users_filter_div.prepend($(el));
            });
	    });
	    
	    $('.itv-user-filter-city').suggest(ajaxurl + '?action=city_lookup', { minchars: 2 });
	    
        $('#save-task-status').click(function(e){
            e.preventDefault();
						
            $('#post-status-display').html($('#post_status option:selected').html());
        });
        
        $('.one_consult_state').change(function(){
            itv_consult_change_state($(this));
        });
	
        $('.one_consult_consultant').change(function(){
            itv_consult_change_consultant($(this));
        });
        
        // remove links for external consult authors
        $('.consult-external-author').each(function(){
            var $author_link = $(this).parent();
            var $author_td = $author_link.parent();
            $author_td.html($author_link.html());
        });
        
        jQuery('.consult-datetime-input-field').datetimepicker({
            format: 'Y-m-d H:i',
            minTime: '06:00',
            maxTime: '23:00',
            defaultTime: '12:00',
            inline:false,
            lang: 'ru',
            onSelectTime: function(current_time, $input) {
                itv_consult_change_datetime($input);
            }
        });
        
        var is_tst_consult_needed_init_val = $('#acf-field-is_tst_consult_needed-1').prop('checked');
        $('#acf-field-is_tst_consult_needed-1')
        .change(function() {
            $('#acf-field-is_tst_consult_needed-1').prop('checked', is_tst_consult_needed_init_val);
        });
        
        if ($('#acf-field-is_tst_consult_needed-1').prop('checked') == false) {
            $('div#acf-is_tst_consult_done').hide();
        } else {
            var tst_logo = $('<img src="' + adminend.site_url + '/wp-content/themes/tstsite/img/te-st-logo.jpg" />');
            tst_logo.css({
                'vertical-align' : 'middle'
            });
            $('div#acf-is_tst_consult_needed li').append(tst_logo);
        }
        
        move_activation_email_button_to_top();
        $('#itv-resend-activation-email').click(function(){
            return itv_resend_activation_email($(this));
        });
        
        move_userxp_field_to_top();
        $('#itv-userxp-add-btn').click(function(){
            return itv_add_xp_to_user($(this));
        });
        
        $('.itv-users-bulk-actions').each(function(i1, el){
            $(el).insertBefore($(el).parent().parent());
        });
        
        $('.tablenav.bottom .itv-users-filter-div').remove();
        
        $('#itv-bulk-resend-activation-email').click(function(){
            return itv_bult_resend_activation_email($(this));
        });
    });
	
	function itv_consult_change_datetime($select) {
        var $loader = $('<img />')
        .attr('src', adminend.site_url + 'wp-includes/images/spinner.gif')
        .addClass('manage-consult-loader');
        $loader.insertAfter($select);
        
        var consult_id = $select.attr('id');
        consult_id = consult_id.match( /(\d+)$/i)
        if(consult_id) {
            consult_id = parseInt(consult_id[1], 10);
        }
        else {
            consult_id = 0;
        }
        
        var consult_datetime = $select.val();
        
        $.post(ajaxurl, {action: 'change-consult-datetime', consult_id: consult_id, datetime: consult_datetime}, null, 'json')
            .done(function(json){
                if(json && json.status == 'ok') {
                    $loader.remove();
                    show_action_done($select);
                }
                else {
                    alert(adminend.common_ajax_error);
                    $loader.remove();
                }
            })
            .fail(function(){
                alert(adminend.common_ajax_error);
                $loader.remove();
            })
            .always(function(){
            });
	}
	
	function itv_consult_change_state($select) {
        var $loader = $('<img />')
        .attr('src', adminend.site_url + 'wp-includes/images/spinner.gif')
        .addClass('manage-consult-loader');
        $loader.insertAfter($select);
        
        var consult_id = $select.attr('id');
        consult_id = consult_id.match( /(\d+)$/i)
        if(consult_id) {
            consult_id = parseInt(consult_id[1], 10);
        }
        else {
            consult_id = 0;
        }
        
        var state_term_id = $select.val();
        
        $.post(ajaxurl, {action: 'change-consult-state', consult_id: consult_id, state_term_id: state_term_id}, null, 'json')
            .done(function(json){
                if(json && json.status == 'ok') {
                    $loader.remove();
                    show_action_done($select);
                }
                else {
                    alert(adminend.common_ajax_error);
                    $loader.remove();
                }
            })
            .fail(function(){
                alert(adminend.common_ajax_error);
                $loader.remove();
            })
            .always(function(){
            });
	}

    function itv_consult_change_consultant($select) {
        var $loader = $('<img />')
        .attr('src', adminend.site_url + 'wp-includes/images/spinner.gif')
        .addClass('manage-consult-loader');
        
        var consult_id = $select.attr('id');
        consult_id = consult_id.match( /(\d+)$/i)
        if(consult_id) {
            consult_id = parseInt(consult_id[1], 10);
        }
        else {
            consult_id = 0;
        }
        var consultant_id = $select.val();
        
        $loader.insertAfter($select);
        $.post(ajaxurl, {action: 'change-consult-consultant', consult_id: consult_id, consultant_id: consultant_id})
            .done(function(){
            })
            .fail(function(){
            })
            .always(function(){
                $loader.remove();
                show_action_done($select);
            });
    }
    
    function show_action_done($el) {
        itv_admin_show_action_done($el);
    }
    
    function move_activation_email_button_to_top() {
        var $tr = $('#itv-is-activated-user-option');
        var $current_parent = $tr.parent();
        $tr.insertBefore('.user-rich-editing-wrap');
        $current_parent.remove();
    }
    
    function move_userxp_field_to_top() {
        var $tr = $('#itv-userxp-user-option');
        var $current_parent = $tr.parent();
        $tr.insertBefore('.user-rich-editing-wrap');
        $current_parent.remove();
    }
    
    function itv_resend_activation_email($button) {
        var user_id = $('#user_id').val();
        
        var $tr = $('#itv-is-activated-user-option');
        var $loader = itv_get_loader();
        $loader.insertAfter($tr.find('#itv-resend-activation-email'));
        
        $.post(ajaxurl, {action: 'resend-activation-email', user_id: user_id})
        .done(function(){
            $tr.find('#itv-user-activated-yes-no-box').hide();
            $tr.find('#itv-user-activation-mail-sent-box').show();
        })
        .fail(function(){
            alert(adminend.common_ajax_error);
        })
        .always(function(){
            $loader.remove();
        });
        return false;
    }
    
    function itv_add_xp_to_user($button) {
        var user_id = $('#user_id').val();
        var $xp_input = $('#itv-userxp-inc');
        if($xp_input.val() && parseInt($xp_input.val())) {
            var $loader = itv_get_loader();
            $loader.insertAfter($button);
            var userxp_value = $xp_input.val();
            var wpnonce = $('#inc_userxp_nonce').val();
            $.post(ajaxurl, {action: 'inc-userxp-value', user_id: user_id, user_xp: userxp_value, nonce: wpnonce}, function(){}, 'json')
            .done(function(json){
                $('#itv-userxp-value').html(json['user_xp']);
                $xp_input.val('');
            })
            .fail(function(){
                alert(adminend.common_ajax_error);
            })
            .always(function(){
                $loader.remove();
            });
        }
        else {
            alert(adminend.empty_xp_inc_val_error);
            $xp_input.focus();
        }
        return false;
    }
    
    function itv_get_loader() {
        return $('<img />')
        .attr('src', adminend.site_url + 'wp-includes/images/spinner.gif')
        .addClass('manage-consult-loader');
    }
    
    function itv_bult_resend_activation_email($button) {
        if(!parseInt($button.data('count'), 10)) {
            alert(adminend.no_expired_activation_users);
            return false;
        }
        
        var $loader = itv_get_loader();
        $loader.insertAfter($button);
        
        $.post(ajaxurl, {action: 'bulk-resend-activation-email'}, null, 'json')
        .done(function(json){
            if(json.status == 'ok') {
                var portion = parseInt(adminend.reactivation_emails_portion, 10);
                if(parseInt(json.remain_count, 10) < portion) {
                    portion = json.remain_count;
                }
                var button_label = adminend.bulk_resend_activation_email_button;
                button_label = button_label.replace(/\{count\}/, json.remain_count);
                button_label = button_label.replace(/\{portion\}/, portion);
                $button.val(button_label);
                $button.data('count', json.remain_count);
            }
            else {
                alert(adminend.common_ajax_error);
            }
        })
        .fail(function(){
            alert(adminend.common_ajax_error);
        })
        .always(function(){
            $loader.remove();
        });
        return false;
    }
	
})(jQuery);

/* block user functionality */
(function($) {
    function pad_date_part(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function get_block_till_date(plus_period) {
        var res_date = new Date();
        var num = parseInt(plus_period.match(/\d+/));

        if(num) {
            if(plus_period.match(/week/)) {
                res_date.setDate(res_date.getDate() + 7 * num);
            }
            else if(plus_period.match(/month/)) {
                res_date.setMonth(res_date.getMonth() + num);
            }
            else if(plus_period.match(/year/)) {
                res_date.setYear(res_date.getFullYear() + num);
            }
        }

        return res_date.getFullYear() + "-" + pad_date_part(res_date.getMonth() + 1, 2) + "-" + pad_date_part(res_date.getDate(), 2)
    }

    function user_block_period_changed($period_select) {
        var $date_input = $('.itv-user-block-till-date');

        if($period_select.val() == 'till_date') {
           $date_input.show();
        }
        else {
           $date_input.hide();
        }

        $date_input.val(get_block_till_date($period_select.val()));
    }

    function block_user_ajax($button, $block_user_form) {
        itv_do_admin_ajax_action($button, {
            'action': 'block_user',
            'nonce': $block_user_form.find('.itv-user-block-nonce').val(),
            'user_id': $block_user_form.find('.itv-user-id').val(),
            'date': $block_user_form.find('.itv-user-block-till-date').val()
        }, function(json) {
            var $link = $('#itv-block-user-link' + json['user_id']);
            $link.data('user-blocked-till', json['date']);
            var $icon = $link.closest('tr').find('.itv-user-lock-icon');
            var $icon_title = $icon.attr('title');
            $icon.attr('title', $icon_title.replace(/(\d+-\d+-\d+)/, json['date']));
            $icon.show();
            $block_user_form.find('.itv-user-unblock-submit').show();
            $block_user_form.find('.itv-block-user-already-blocked').show();
        });
    }
    
    function unblock_user_ajax($button, $block_user_form) {
        itv_do_admin_ajax_action($button, {
	        'action': 'unblock_user',
	        'nonce': $block_user_form.find('.itv-user-block-nonce').val(),
	        'user_id': $block_user_form.find('.itv-user-id').val(),
	        'date': $block_user_form.find('.itv-user-block-till-date').val()
	    }, function(json) {
            var $link = $('#itv-block-user-link' + json['user_id']);
            $link.data('user-blocked-till', '');
            var $icon = $link.closest('tr').find('.itv-user-lock-icon');
            $icon.hide();
            $block_user_form.find('.itv-user-unblock-submit').hide();
            $block_user_form.find('.itv-block-user-already-blocked').hide();
	    });
    }
    
    function move_lock_icon_to_name_column() {
        $('.itv-user-lock-icon').each(function(){
            $(this).closest('tr').find('.column-name').append($(this));
        });
    }

    $(function() {
        var $block_user_form = $('#itv-block-user-form');

        if (!$block_user_form.length) {
            return;
        }

        $block_user_form.find('.itv-block-user-period').change(function () {
            user_block_period_changed($(this));
        });

        $block_user_form.find('.itv-user-block-till-date').datetimepicker({
            format: 'Y-m-d',
            timepicker: false,
            inline: false,
            lang: 'ru',
            style: 'z-index: 100060'
        });

        $('.itv-block-user-link').click(function () {
            var $user_blocked_till = $(this).data('user-blocked-till');
            $block_user_form.find('.itv-block-user-nicename').text($(this).data('user-nicename'));
            $block_user_form.find('.itv-user-id').val($(this).data('user-id'));

            if($user_blocked_till) {
                $block_user_form.find('.itv-block-user-period').val('till_date');
                $block_user_form.find('.itv-user-block-till-date').val($user_blocked_till);
                $block_user_form.find('.itv-user-block-till-date').show();
                $block_user_form.find('.itv-user-unblock-submit').show();
                $block_user_form.find('.itv-block-user-already-blocked').show();
            }
            else {
                $block_user_form.find('.itv-block-user-period').val('1 week');
                user_block_period_changed($block_user_form.find('.itv-block-user-period'));
                $block_user_form.find('.itv-user-unblock-submit').hide();
                $block_user_form.find('.itv-block-user-already-blocked').hide();
            }
        });

        $block_user_form.find('.itv-user-block-submit').click(function(){
            block_user_ajax($(this), $block_user_form);
        });
        
        $block_user_form.find('.itv-user-unblock-submit').click(function(){
            unblock_user_ajax($(this), $block_user_form);
        });
        
        $('.itv-user-lock-icon').click(function(){
        	$(this).closest('tr').find('.itv-block-user-link').click();
        });
        
        move_lock_icon_to_name_column();
    });

})(jQuery);

function itv_do_admin_ajax_action($button, $params, $ok_callback) {
    var $ = jQuery;
    var $loader = $('<img />')
    .attr('src', adminend.site_url + 'wp-includes/images/spinner.gif')
    .addClass('manage-consult-loader');
    $loader.insertAfter($button);
    $button.prop('disabled', true);

    $.post(adminend.ajaxurl, $params, null, 'json')
        .done(function(json) {
            if(json && json['status'] == 'ok') {
                itv_admin_show_action_done($button);
            	$ok_callback(json);
            }
            else {
                if(json && json['message']) {
                    alert(json['message']);
                }
                else {
                    alert(adminend.common_ajax_error);
                }
            }
        })
        .fail(function() {
            alert(adminend.common_ajax_error);
        })
        .always(function() {
            $button.prop('disabled', false);
            $loader.remove();
        });
}

function itv_admin_show_action_done($el) {
    var $ = jQuery;
    var $done = $('<span />').addClass('dashicons-before dashicons-yes itv-admin-action-done-icon');
    $done.insertAfter($el);
    setTimeout(function(){
        $done.fadeOut(200, function(){
            $(this).remove();
        });
    }, 2000);
}
