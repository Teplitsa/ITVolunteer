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
            $('#itv-upload-res-screen-loading').show();
            return true;
        },
        onComplete: function(result) {
            var json;
            try {
                json = jQuery.parseJSON( result );
            } catch(ex) {}
            $('#itv-upload-res-screen-loading').hide();
            
            if(json && json.status == 'ok' && json.image) {
                var $template = $('.itv-res-screen-item').first().clone(true, true);
                
                $template.find('.delete_res_screen')
                    .data('screen_id', json.screen_id)
                    .show();
                
                var image = json.image;
                image = '<' + image + '>';
                $template.find('.itv-upload-res-screen-info')
                    .attr('href', json.full_image_src)
                    .html(image)
                    .addClass('swipebox')
                    .show();
                
                $('#itv-res-screen-list').append($template);
                $template.show();
                $( '.swipebox' ).swipebox();
                
                if(json['is_limit']) {
                    $("#upload_res_screen").hide();
                }
            }
            else {
                if(json.status == 'error' && json['is_limit']) {
                    alert(frontend.screens_limit_exceeded);
                    $("#upload_res_screen").hide();
                }
                else {
                    alert(frontend.user_company_logo_upload_error);
                }
            }
        }
    });
    
    $('#itv-res-screen-list').on('click', '.delete_res_screen', function(){
        if(!confirm(frontend.sure_delete_screen)) {
            return false;
        }
        
        var $button = $(this);
        var $item = $button.closest('.itv-res-screen-item');
        
        $item.find('.itv-upload-res-screen-loading').show();
        $item.find('.itv-upload-res-screen-info').hide();
        
        $.getJSON(frontend.ajaxurl, {action: 'delete-result-screenshot', 'screen_id': $button.data('screen_id')})
            .done(function(){
                $item.find('.itv-upload-res-screen-info').empty();
                $item.find('.delete_res_screen').hide();
                $item.remove();
                $("#upload_res_screen").show();
            })
            .fail(function(){
                $item.find('.itv-upload-res-screen-info').show();
                alert(frontend.res_screen_delete_error);
            })
            .always(function(){
                $item.find('.itv-upload-res-screen-loading').hide();
            });
    });
    
    $( '.swipebox' ).swipebox();
});