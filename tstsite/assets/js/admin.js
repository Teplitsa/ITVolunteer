/* scripts */

(function($) {
 
	$(document).ready(function(){
	    var $p2p_users_by_task_filter = $('body.wp-admin.users-php select[name="p2p[task-doers][from]"]');
	    var $users_filter_div = $p2p_users_by_task_filter.closest('div');
	    $p2p_users_by_task_filter.hide();
	    var $activated_status_filter = $('#users_activation_status');
	    $users_filter_div.append($activated_status_filter);
	    $users_filter_div.find('input[type=submit]').val($activated_status_filter.data('filter-button-title'));
	    
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
	$('#acf-field-is_tst_consult_needed-1').change(function(){
		$('#acf-field-is_tst_consult_needed-1').prop('checked', is_tst_consult_needed_init_val);
	});	
	
	if($('#acf-field-is_tst_consult_needed-1').prop('checked') == false) {
		$('div#acf-is_tst_consult_done').hide();
	}
	else {
		var tst_logo = $('<img src="'+adminend.site_url+'/wp-content/themes/tstsite/img/te-st-logo.jpg" />');
		tst_logo.css({'vertical-align': 'middle'});
		$('div#acf-is_tst_consult_needed li').append(tst_logo);
	}
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
        var $done = $('<span />').addClass('dashicons-before dashicons-yes itv-admin-action-done-icon');
        $done.insertAfter($el);
        setTimeout(function(){
            $done.fadeOut(200, function(){
                $(this).remove();
            });
        }, 2000);
    }
	
})(jQuery);
