/* scripts */

(function($) {
 
	$(document).ready(function(){
        $('#save-task-status').click(function(e){
            e.preventDefault();
						
            $('#post-status-display').html($('#post_status option:selected').html());
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
	
	
})(jQuery);