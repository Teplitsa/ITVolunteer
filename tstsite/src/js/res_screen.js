$(function(){
    // task result screenshots
    
    $("#upload_res_screen").ajaxUpload({
        url: frontend.ajaxurl,
        name: "res_screen",
        data: {
            action: 'upload-result-screenshot',
            task_id: $("#upload_res_screen").data('task_id')
        },
        onSubmit: function() {
            $('#upload_res_screen_info').hide();
            $('#upload_res_screen_loading').show();
            return true;
        },
        onComplete: function(result) {
            var json;
            try {
                json = jQuery.parseJSON( result );
            } catch(ex) {}
            $('#upload_res_screen_loading').hide();
            
            if(json && json.status == 'ok' && json.image) {
                var image = json.image;
                image = '<' + image + '>';
                $('#upload_res_screen_info').html(image);
                $('#upload_res_screen_info').show();
                $('#delete_res_screen').show();
            }
            else {
                alert(frontend.user_company_logo_upload_error);
                $('#upload_res_screen_info').empty();
            }
        }
    });
    
    $('.delete_res_screen').click(function(){
        $('#upload_res_screen_loading').show();
        $('#upload_res_screen_info').hide();
        
        $.getJSON(frontend.ajaxurl, {action: 'delete-result-screenshot', 'task_id': $(this).data('task_id')})
            .done(function(){
                $('#upload_res_screen_info').empty();
                $('#delete_res_screen').hide();
            })
            .fail(function(){
                $('#upload_res_screen_info').show();
                alert(frontend.res_screen_delete_error);
            })
            .always(function(){
                $('#upload_res_screen_loading').hide();
            });
    });
});