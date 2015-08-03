/* scripts */

jQuery(function($){
	
	$('html').removeClass('no-js').addClass('js');	
	var windowWidth = $('#page').width();
	
	/* Responsive nav */	
    var navCont = $('#site_navigation');
    $('#menu-trigger').on('click', function(e){

        e.preventDefault();
        if (navCont.hasClass('toggled')) { 
            //remove
            navCont.find('.site-navigation-area').slideUp('normal', function(){
				navCont.removeClass('toggled');
				navCont.find('.site-navigation-area').removeAttr('style');
			});
            
        }
        else { 
            //add
            navCont.find('.site-navigation-area').slideDown('normal', function(){
				navCont.addClass('toggled');
				navCont.find('.site-navigation-area').removeAttr('style');
			});
            
        }
    });
	
	var sticky_navigation_offset_top = navCont.offset().top;
		
	var sticky_navigation = function(){

		if($(window).scrollTop() > sticky_navigation_offset_top) {
			$('body').addClass('fixed-nav');
		} else {
			$('body').removeClass('fixed-nav');			
		}   
	};
	
	//sticky_navigation();
	$(window).scroll(function() {
		//sticky_navigation();
	});
    
	
	/* Masonry */
	var $members_list = $('.members-list');
	
	//imagesLoaded doesn't work because of gravatar
	$members_list.masonry({itemSelector: '.member'});			
	$(window).resize(function(){			
		$members_list.masonry('bindResize');		
	});
	
	
	var $tasks_list = $('.tasks-list');
	
	$tasks_list.masonry({
		itemSelector: '.item-masonry'
	});			
	
	$(window).resize(function(){			
		$tasks_list.masonry('bindResize');		
	});
	
	
	var $posts_list = $('.post-list'); 
	
	$posts_list.masonry({
		itemSelector: '.tpl-post'
	});
	$posts_list.imagesLoaded().progress( function() {
		$posts_list.masonry('layout');
	});	
	$(window).resize(function(){			
		$posts_list.masonry('bindResize');		
	});
	
	
	
	/* current paging item */
	$('ul.pagination').find('span.current').parents('li').addClass('active');
	
    $('#deadline').datepicker({
        dateFormat : 'dd.mm.yy', // to show on frontend
//        altField: '#deadline-real',
//        altFormat: 'dd.mm.yy', // to send to backend
        minDate: new Date()
    });

    $('#task-tags').chosen({
        disable_search_threshold: 10,
        max_selected_options: 3,
        no_results_text: frontend.chosen_no_results_text,
		width: '99%'
    });

    $('#task-delete').click(function(){
        var $form = $('#task-action');
        is_ok = confirm(frontend.task_delete_confirm);
        if(is_ok) {
        	$form.data('delete-clicked', 'true');
        }
        else {
        	$form.data('delete-clicked', '');
        }
        return is_ok
    });

    $('#open-contact-form').click(function(e){
        e.preventDefault();

        $(this).slideUp(200);
        $('#contact-form').slideDown(200);
    });
	
	 $('#close-contact-form').click(function(e){
        e.preventDefault();
		
		$('#contact-form').slideUp(200);
        $('#open-contact-form').slideDown(200);
        
    });

    $('#contact-form').on('submit', '', function(e){
        e.preventDefault();

        var $form = $(this),
            $submit = $form.find('input[type="submit"]'),
            form_is_valid = true,
            val = '';

        if( !$form.find('#name-field').val() ) {
            $('#name-message').html(frontend.contactor_name_empty).show();
            form_is_valid = false;
        } else
            $form.find('#name-message').html('').hide();

        val = $form.find('#email-field').val();
        if( !val.length ) {
            form_is_valid = false;
            $form.find('#email-message').html(frontend.user_email_empty).show();
        } else if( !email_is_valid(val) ) {
            form_is_valid = false;
            $form.find('#email-message').html(frontend.user_email_incorrect).show();
        } else
            $form.find('#email-message').html('').hide();

        if( !$form.find('#message-field').val() ) {
            $('#message-message').html(frontend.contactor_message_empty).show();
            form_is_valid = false;
        } else
            $form.find('#message-message').html('').hide();

        if( !form_is_valid )
            return;

        $submit.attr('disabled', 'disabled');
        $form.find('#result-message').html('').hide();
		
		var page_url;
		try {
			page_url = window.location.href;
		} catch(ex){}

        $.post(frontend.ajaxurl, {
            'action': 'add-message',
			'page_url': page_url,
            'nonce': $form.find('#nonce').val(),
            'name': $form.find('#name-field').val(),
            'email': $form.find('#email-field').val(),
            'message': $form.find('#message-field').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok')
                $form.find('#result-message').html(resp.message).show();

            $submit.removeAttr('disabled');
        });
    });

	var $form = $('#task-action');
	$('#task-publish').click(function(e){
        $('#task-draft').removeClass('e-clicked');
		$(this).addClass('e-clicked');
	});
    $('#task-draft').click(function(e){
        $('#task-publish').removeClass('e-clicked');
        $(this).addClass('e-clicked');
    });

	$form.submit(function(e){
        e.preventDefault();

        var $form = $(this),
//          $submit_used = $form.find("input[type='submit']:focus"); not working in FF on Mac
			$submit_used = $form.find('.e-clicked'),
            tags_list = $form.find('#task-tags').val(),
            form_is_valid = true,
            val = '';

        if( !$submit_used.length && !$form.data('delete-clicked')) // Submit only by click on one of the submit buttons
            return;
        
        // remove click flags
        $form.data('delete-clicked', '');

        $form.find('.validation-message').html('').hide();

        val = $form.find('#task-title').val();
        if( !val.length ) {
            form_is_valid = false;
            $form.find('#task-title-vm').html(frontend.task_title_is_required).show();
        } else
            $form.find('#task-title-vm').html('').hide();

        if($submit_used.attr('name') == 'task-publish') {

            val = $form.find('#task-descr').val();
            if( !val.length ) {
                form_is_valid = false;
                $form.find('#task-descr-vm').html(frontend.task_descr_is_required).show();
            } else
                $form.find('#task-descr-vm').html('').hide();

            val = $form.find('#expecting').val();
            if( !val.length ) {
                form_is_valid = false;
                $form.find('#expecting-vm').html(frontend.expecting_is_required).show();
            } else
                $form.find('#expecting-vm').html('').hide();

//            val = $form.find('#about-reward').val();
//            if( !val.length ) {
//                form_is_valid = false;
//                $form.find('#about-reward-vm').html(frontend.about_reward_is_required).show();
//            } else
//                $form.find('#about-reward-vm').html('').hide();

            val = $form.find('#about-author-org').val();
            if( !val.length ) {
                form_is_valid = false;
                $form.find('#about-author-org-vm').html(frontend.about_author_org_is_required).show();
            } else
                $form.find('#about-author-org-vm').html('').hide();

            val = $form.find('#deadline').val();
            if( !val.length ) {
                form_is_valid = false;
                $form.find('#deadline-vm').html(frontend.deadline_is_required).show();
            } else
                $form.find('#deadline-vm').html('').hide();

            val = tags_list;
            if( !val || !val.length ) {
                form_is_valid = false;
                $form.find('#task-tags-vm').html(frontend.some_tags_are_required).show();
            } else
                $form.find('#task-tags-vm').html('').hide();

            val = $form.find('#reward').val();
            if( !val ) {
                form_is_valid = false;
                $form.find('#reward-vm').html(frontend.reward_is_required).show();
            } else
                $form.find('#reward-vm').html('').hide();
        }

        if( !form_is_valid )
            return;

		$submit_used.removeClass('e-clicked');

        $form.find('.task-submit').attr('disabled', 'disabled');

        if(tags_list)
            tags_list = tags_list.join(',');
	    
	var is_tst_consult_needed = 0;
	if($form.find('#is_tst_consult_needed').prop('checked')) {
		is_tst_consult_needed = 1;
	}

        $.post(frontend.ajaxurl, {
            'action': 'add-edit-task',
            'status': $submit_used.attr('name') == 'task-publish' ?
                $form.find('#status').val() : ($submit_used.attr('name') == 'task-draft' ? 'draft' : 'trash'),
            'id': $form.find('#task_id').val(),
            'title': $form.find('#task-title').val(),
            'descr': $form.find('#task-descr').val(),
	    'is_tst_consult_needed': is_tst_consult_needed,
            'expecting': $form.find('#expecting').val(),
            'about-reward': $form.find('#about-reward').val(),
            'about-author-org': $form.find('#about-author-org').val(),
            'deadline': $form.find('#deadline').val(),
            'reward': $form.find('#reward').val(),
            'tags': tags_list
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'deleted') {
                window.location.href = frontend.site_url+'member-actions/member-tasks/?t=1';
            } else if(resp.status == 'saved' || resp.is_already_published) { // resp.status == 'saved'
                window.location.href = frontend.site_url+'task-actions/?task='+resp.id+'&t=2';
            } else if(resp.status == 'ok') {
                window.location.href = frontend.site_url+'task-actions/?task='+resp.id+'&t=1';
            }
        });
    });

    /* Task page sidebar, Guest viewing */
    //$('#guest-help').click(function(e){
    //    e.preventDefault();
    //
    //    $(this).attr('disabled', 'disabled');
    //    $('#default').slideUp(100);
    //    $('#login-please').slideDown(100);
    //});

    $('#author-publish').click(function(e){
        e.preventDefault();

        var $form = $('#task-publish'),
            $button = $(this);

        $button.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'publish-task',
            'task-id': $form.find('#task-id').val(),
            'nonce': $form.find('#nonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = resp.permalink+'?t=1';
            } else {
                $button.removeAttr('disabled');
                $form.find('#task-message').html(resp.message);
            }

        });
    });

    $('#author-unpublish').click(function(e){
        e.preventDefault();

        var $form = $('#task-unpublish'),
            $button = $(this);

        $button.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'unpublish-task',
            'task-id': $form.find('#task-id').val(),
            'nonce': $form.find('#nonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = window.location.href.indexOf('?') > 0 ?
                    window.location.href+'&t=2' : window.location.href+'?t=2';
            } else {
                $button.removeAttr('disabled');
                $form.find('#task-message').html(resp.message);
            }

        });
    });

    $('#task-send-to-work').click(function(e){
        e.preventDefault();

        var $button = $(this),
            $form = $('#task-send-to-work-form');

        $button.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'task-in-work',
            'task-id': $form.find('#task-id').val(),
            'nonce': $form.find('#nonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = window.location.href.indexOf('?') > 0 ?
                    window.location.href+'&t=3' : window.location.href+'?t=3';
            } else {
                $button.removeAttr('disabled');
                $form.find('#task-message').html(resp.message);
            }

        });
    });

    $('#author-close').click(function(e){
        e.preventDefault();

        var $form = $('#task-close'),
            $button = $(this);

        $button.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'close-task',
            'task-id': $form.find('#task-id').val(),
            'nonce': $form.find('#nonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = window.location.href.indexOf('?') > 0 ?
                    window.location.href+'&t=4' : window.location.href+'?t=4';
            } else {
                $button.removeAttr('disabled');
                $form.find('#task-message').html(resp.message);
            }

        });
    });

    $('.candidate-ok').click(function(e){
        e.preventDefault();

        var $this = $(this);

        $.post(frontend.ajaxurl, {
            'action': 'approve-candidate',
            'link-id': $this.data('link-id'),
            'task-id': $this.data('task-id'),
            'doer-id': $this.data('doer-id'),
            'nonce': $this.data('nonce')
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = window.location.href.indexOf('?') > 0 ?
                    window.location.href+'&t=5' : window.location.href+'?t=5';
            } else {
                $('#task-action-message').html(resp.message).slideDown(200);
            }

        });
    });

    $('.candidate-refuse').click(function(e){
        e.preventDefault();

        var $this = $(this);

        $.post(frontend.ajaxurl, {
            'action': 'refuse-candidate',
            'link-id': $this.data('link-id'),
            'task-id': $this.data('task-id'),
            'doer-id': $this.data('doer-id'),
            'nonce': $this.data('nonce')
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = window.location.href.indexOf('?') > 0 ?
                    window.location.href+'&t=6' : window.location.href+'?t=6';
            } else {
                $('#task-action-message').html(resp.message).slideDown(200);
            }

        });
    });
    
    $('.leave-review').click(function(e){
        e.preventDefault();

        $(this).hide();
        $('#task-leave-review-form').slideDown(200);
        $('#task-leave-review-form').find('#doer-id').val($(this).data('doer-id'));
    });

    $('#cancel-leave-review').click(function(e){
        $('.leave-review').show();
        $('#task-leave-review-form').slideUp(200);
    });
    
    $('#task-leave-review-form').submit(function(e){
        e.preventDefault();

        $('#add_review_loading').show();
        
        var $form = $(this),
            $buttons = $form.find('input[type="submit"][type="reset"]');

        $buttons.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'leave-review',
            'task-id': $form.find('#task-id').val(),
            'doer-id': $form.find('#doer-id').val(),
            'review-message': $form.find('#review-message').val(),
            'nonce': $form.find('#nonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
            	$('#add_review_loading').hide();
                $('#task-leave-review-form').remove();
                $('#task-review-message-ok-message').html(resp.message);
                $('#task-review-message-ok-message').show();
            } else {
            	$('#add_review_loading').hide();            	
                $buttons.removeAttr('disabled');
                $form.find('#task-review-message').html(resp.message);
            }

        });
    });

    $('#task-offer-help').click(function(e){
        e.preventDefault();

        $(this).slideUp(200);
        $('#task-status').slideUp(200);
        $('#task-offer-help-form').slideDown(200);
    });

    $('#cancel-sending-message').click(function(e){
        $('#task-offer-help').slideDown(200);
        $('#task-status').slideDown(200);
        $('#task-offer-help-form').slideUp(200);
    });

    $('#task-offer-help-form').submit(function(e){
        e.preventDefault();

        var $form = $(this),
            $buttons = $form.find('input[type="submit"][type="reset"]');

        $buttons.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'add-candidate',
            'task-id': $form.find('#task-id').val(),
            'candidate-message': $form.find('#candidate-message').val(),
            'nonce': $form.find('#nonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = window.location.href.indexOf('?') > 0 ?
                    window.location.href+'&t=7' : window.location.href+'?t=7';
            } else {
                $buttons.removeAttr('disabled');
                $form.find('#task-message').html(resp.message);
            }

        });
    });

    $('#task-remove-offer').click(function(e){
        e.preventDefault();

        $(this).slideUp(200);
        $('#task-status').slideUp(200);
        $('#task-remove-offer-form').slideDown(200);
    });

    $form = $('#task-remove-offer-form');
    $form.find('#cancel-sending-message').click(function(e){
        $('#task-remove-offer').slideDown(200);
        $('#task-status').slideDown(200);
        $('#task-remove-offer-form').slideUp(200);
    });

    $form.submit(function(e){
        e.preventDefault();

        var $form = $(this),
            $buttons = $form.find('input[type="submit"][type="reset"]');

        $buttons.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'remove-candidate',
            'task-id': $form.find('#task-id').val(),
            'candidate-message': $form.find('#candidate-message').val(),
            'nonce': $form.find('#nonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = window.location.href.indexOf('?') > 0 ?
                    window.location.href+'&t=8' : window.location.href+'?t=8';
            } else {
                $buttons.removeAttr('disabled');
                $form.find('#task-message').html(resp.message);
            }

        });
    });
	
	/** Registration & Login **/
	$('#user_login').focus();
	
    $('#login-form').submit(function(e){
        e.preventDefault();

        var $form = $(this),
            $button = $form.find('#do-login');

        $button.attr('disabled', 'disabled');

        $.post(frontend.ajaxurl, {
            'action': 'login',
            'login': $form.find('#user_login').val(),
            'pass': $form.find('#user_pass').val(),
            'remember': $form.find('#rememberme').attr('checked') ? 1 : 0,
            'nonce': $form.find('#_wpnonce').val()
        }, function(resp){

            resp = jQuery.parseJSON(resp);

            if(resp.status == 'ok') {
                window.location.href = $form.find('#redirect_to').val();
            } else {
                $button.removeAttr('disabled');
                $form.find('#login-message').html(resp.message).show();
            }

        });
    });

    $('#user-reg').submit(function(e){
        e.preventDefault();

        var $form = $(this),
            $submit = $form.find('#do-register'),
            form_is_valid = true,
            val = '';

        // Validation:
        val = $form.find('#user_login').val();
        if(val.length <= 3) {
            form_is_valid = false;
            $form.find('#user_login_vm').html(frontend.user_login_too_short).show();
        } else if( !val.match(/^([a-zA-Z0-9\-])*$/) ) {
            form_is_valid = false;
            $form.find('#user_login_vm').html(frontend.user_login_incorrect).show();
        } else
            $form.find('#user_login_vm').html('').hide();

        val = $form.find('#email').val();
        if( !val.length ) {
            form_is_valid = false;
            $form.find('#user_email_vm').html(frontend.user_email_empty).show();
        } else if( !email_is_valid(val) ) {
            form_is_valid = false;
            $form.find('#user_email_vm').html(frontend.user_email_incorrect).show();
        } else
            $form.find('#user_email_vm').html('').hide();

        val = $form.find('#pass1').val();
        if(val != $form.find('#pass2').val()) {
            form_is_valid = false;
            $form.find('#user_pass_vm').html(frontend.passes_are_inequal).show();
        } else if( !val.length ) {
            form_is_valid = false;
            $form.find('#user_pass_vm').html(frontend.user_pass_empty).show();
        } else
            $form.find('#user_pass_vm').html('').hide();

        val = $form.find('#first_name').val();
        if(val.length < 3) {
            form_is_valid = false;
            $form.find('#first_name_vm').html(frontend.first_name_too_short).show();
        } else
            $form.find('#first_name_vm').html('').hide();

        val = $form.find('#last_name').val();
        if(val.length < 3) {
            form_is_valid = false;
            $form.find('#last_name_vm').html(frontend.last_name_too_short).show();
        } else
            $form.find('#last_name_vm').html('').hide();

        if(form_is_valid) {
//            $submit.attr('disabled', 'disabled');
            $submit.parents('.form-group').hide();
            $('#register-form-message').html('').hide();

            $.post(frontend.ajaxurl, {
                'action': 'user-register',
                'login': $form.find('#user_login').val(),
                'email': $form.find('#email').val(),
                'pass': $form.find('#pass1').val(),
                'first_name': $form.find('#first_name').val(),
                'last_name': $form.find('#last_name').val(),
                'nonce': $form.find('#_wpnonce').val()
            }, function(resp){

                resp = jQuery.parseJSON(resp);

                if(resp.status == 'ok')
                    $form.fadeOut(200);
                else
                    $submit.parents('.form-group').show();

                $('#register-form-message').html(resp.message).show();
            });
        }
    });
	
	
	

    $('#delete_profile').click(function(e){
        e.preventDefault();

        if(confirm(frontend.profile_delete_confirm)) {
            var $this = $(this),
                $actions = $this.parents('.form-group');

            $actions.hide();
            $.post(frontend.ajaxurl, {
                'action': 'delete-profile',
                'id': $('#member_id').val(),
                'nonce': $('#_wpnonce').val()
            }, function(resp){

                resp = $.parseJSON(resp);
                if(resp.status == 'ok') {
                    window.location.href = frontend.site_url+'?t=1';
                } else {
                    $('#form_message').html(resp.message).show();
                    $actions.show();
                }
            });

        }
    });

    $('#member_action').submit(function(e){
        e.preventDefault();

        var $form = $(this),
            $submit = $form.find('#do_member_action'),
            form_is_valid = true,
            val = '';

        // Validation:
        val = $form.find('#email').val();
        if( !val.length ) {
            form_is_valid = false;
            $form.find('#user_email_vm').html(frontend.user_email_empty).show();
        } else if( !email_is_valid(val) ) {
            form_is_valid = false;
            $form.find('#user_email_vm').html(frontend.user_email_incorrect).show();
        } else
            $form.find('#user_email_vm').html('').hide();

        val = $form.find('#pass1').val();
        if(val != $form.find('#pass2').val()) {
            form_is_valid = false;
            $form.find('#user_pass_vm').html(frontend.passes_are_inequal).show();
        } else
            $form.find('#user_pass_vm').html('').hide();

        val = $form.find('#first_name').val();
        if(val.length < 3) {
            form_is_valid = false;
            $form.find('#first_name_vm').html(frontend.first_name_too_short).show();
        } else
            $form.find('#first_name_vm').html('').hide();

        val = $form.find('#last_name').val();
        if(val.length < 3) {
            form_is_valid = false;
            $form.find('#last_name_vm').html(frontend.last_name_too_short).show();
        } else
            $form.find('#last_name_vm').html('').hide();

        if(form_is_valid) {
            $submit.parents('.form-group').hide(); //.attr('disabled', 'disabled');
			
            $user_skills = [];
            $('.skills_list').find('.user_skill:checked').each(function(){
                $user_skills.push($(this).val());
            });

            var params = {
                'action': 'update-member-profile',
                'nonce': $form.find('#_wpnonce').val(),
                'id': $form.find('#member_id').val(),
                'email': $form.find('#email').val(),
                'pass': $form.find('#pass1').val(),
                'first_name': $form.find('#first_name').val(),
                'last_name': $form.find('#last_name').val(),
                'city': $form.find('#user_city').val(),
                'spec': $form.find('#user_speciality').val(),
                'bio': $form.find('#user_bio').val(),
                'pro': $form.find('#user_professional').val(),
                'user_skills': $user_skills,
                'user_workplace': $form.find('#user_workplace').val()
            };
            $('.user_contacts').each(function(index){
                var $this = $(this);
                params[$this.attr('id')] = $this.val();
            });
            $.post(frontend.ajaxurl, params, function(resp){

                resp = jQuery.parseJSON(resp);

//                if(resp.status == 'ok') {
                    // ...
//                } else {
                    // ...
//                }

                $submit.parents('.form-group').show();//.removeAttr('disabled');
                $('#form_message').html(resp.message);
            });
        }
    });
	
	/* tooltip */
	$('.role-desc').tooltip();

    $('#task-tabs').find('.nav-tabs').find('a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
	
	
	/*  reveal comment */
	var hash = location.hash.replace('#', '');
	if (hash.indexOf("comment") !=-1) {
		//alert(hash);
		var TTabs = $('.task-details').find('.grey-tabs'),
			TPanels = $('.tab-content');
		
		TTabs.find('li').removeClass('active');
		TTabs.find('a[href="#t-comments"]').parents('li').addClass('active');
		TPanels.find('#t-details').removeClass('active').addClass('fade');
		TPanels.find('#t-comments').addClass('active').removeClass('fade');
		
		var STarget = $('.task-details').find('#'+hash).offset().top - 90;	
		//$('html, body').animate({scrollTop:STarget}, 300);
		$('html, body').scrollTop(STarget);
	}
	
	
    

    $('#tasks-filters-trigger').click(function(e){
        e.preventDefault();

        $('#tasks-filters').toggle();
    });
	
    $('#members-filters-trigger').click(function(e){
        e.preventDefault();

        $('#members-filters').toggle();
    });

	// company logo
    $("#upload_user_company_logo").ajaxUpload({
		url: frontend.ajaxurl,
		name: "user_company_logo",
		data: {
			action: 'upload-user-company-logo'
		},
		onSubmit: function() {
			$('#upload_user_company_logo_info').hide();
			$('#upload_user_company_logo_loading').show();
			return true;
		},
		onComplete: function(result) {
			var json;
			try {
				json = jQuery.parseJSON( result );
			} catch(ex) {}
			$('#upload_user_company_logo_loading').hide();
			
			if(json && json.status == 'ok' && json.image) {
				var image = json.image;
				image = '<' + image + '>';
				$('#upload_user_company_logo_info').html(image);
				$('#upload_user_company_logo_info').show();
				$('#delete_user_company_logo').show();
			}
			else {
				alert(frontend.user_company_logo_upload_error);
				$('#upload_user_company_logo_info').empty();
			}
		}
	});
	
	$('#delete_user_company_logo').click(function(){
		$('#upload_user_company_logo_loading').show();
		$('#upload_user_company_logo_info').hide();
		
		$.getJSON(frontend.ajaxurl, {action: 'delete-user-company-logo'})
			.done(function(){
				$('#upload_user_company_logo_info').empty();
				$('#delete_user_company_logo').hide();
			})
			.fail(function(){
				$('#upload_user_company_logo_info').show();
				alert(frontend.user_company_logo_delete_error);
			})
			.always(function(){
				$('#upload_user_company_logo_loading').hide();
			});
	});

	// user logo
    $("#upload_user_avatar").ajaxUpload({
		url: frontend.ajaxurl,
		name: "user_avatar",
		data: {
			action: 'upload-user-avatar'
		},
		onSubmit: function() {
			$('#upload_user_avatar_info').hide();
			$('#upload_user_avatar_loading').show();
			return true;
		},
		onComplete: function(result) {
			var json;
			try {
				json = jQuery.parseJSON( result );
			} catch(ex) {}
			$('#upload_user_avatar_loading').hide();
			
			if(json && json.status == 'ok' && json.image) {
				var image = json.image;
				image = '<' + image + '>';
				$('#upload_user_avatar_info').html(image);
				$('#upload_user_avatar_info').show();
				$('#delete_user_avatar').show();
			}
			else {
				alert(frontend.user_company_logo_upload_error);
				$('#upload_user_avatar_info').empty();
			}
		}
	});
	
	$('#delete_user_avatar').click(function(){
		$('#upload_user_avatar_loading').show();
		$('#upload_user_avatar_info').hide();
		
		$.getJSON(frontend.ajaxurl, {action: 'delete-user-avatar'})
			.done(function(){
				$('#upload_user_avatar_info').empty();
				$('#delete_user_avatar').hide();
			})
			.fail(function(){
				$('#upload_user_avatar_info').show();
				alert(frontend.user_avatar_delete_error);
			})
			.always(function(){
				$('#upload_user_avatar_loading').hide();
			});
	});
	
	function email_is_valid(value) {
        return value.match(/(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)/);
    }
});


//GA Events
jQuery(function($){
		
	
	if(typeof ga == 'function') {		
		$('.ga-event-trigger').on('click', function(e){
		
			var trigger = $(this),
				label = trigger.attr('data-ga_label'),
				action = trigger.attr('data-ga_action'),
				category = trigger.attr('data-ga_category');
			
			//to_do check for the correct value
			//debug
			console.log(category);
			console.log(action);
			console.log(label);
			
			ga('send', 'event', category, action, label, 1);	
		});		
	}	
});

// customize comments subscriptions
jQuery(function($){
	$('#subscribe-reloaded').prop('checked', 'checked');
});
