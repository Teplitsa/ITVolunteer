/* scripts */

(function($) {
 
	$(document).ready(function(){
        $('#save-task-status').click(function(e){
            e.preventDefault();

            $('#post-status-display').html($('#post_status option:selected').html());
        });
    });

})(jQuery);