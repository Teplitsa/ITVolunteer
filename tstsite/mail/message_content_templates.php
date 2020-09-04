<?php
class ItvEmailTemplates {
    
    public static $YOU_HAVE_BEEN_BLOCKED = 'you_have_been_blocked';
    public static $YOU_HAVE_BEEN_UNBLOCKED = 'you_have_been_unblocked';
    
    public $email_templates_atvetka_style = [];
    
    private $_email_templates;
    private static $_instance = NULL;
    public function __construct() {
        $this->_email_templates = array(
            'approve_candidate_doer_notice' => array(
                'title' => __('IT-Volunteer: you have been approved as participant!', 'tst'),
                'text' => __("Greetings, %s!\n\nYou have been approved to participate in task: %s.\n\nYou can contact the task author for details with email: <a href='mailto:%s'>%s</a> or in some other ways (see <a href='%s'>author's profile</a>).\n\nHave a nice day!", 'tst'),
            ),
            'approve_candidate_author_notice' => array(
                'title' => __('IT-Volunteer: participant approved!', 'tst'),
                'text' => __("Greetings, %s!\n\nYou have approved some volunteer to participate in task: %s.\n\nYou can contact the task doer for details with email: <a href='mailto:%s'>%s</a> or in some other ways (see <a href='%s'>doer's profile</a>).\n\nHave a nice day!", 'tst'),
            ),
            'refuse_candidate_doer_notice' => array(
                'title' => __('IT-Volunteer: you have been disapproved as participant', 'tst'),
                'text' => __("Hello, %s.\n\nYou have been disapproved to participate in task: %s.\n\nHave a nice day!", 'tst'),
            ),
            'refuse_candidate_author_notice' => array(
                'title' => __('IT-Volunteer: a volunteer for your task removed himself!', 'tst'),
                'text' => __("Hello, %s.\n\nSomeone has been removed himself from a volunteers for your task: %s.\n\nHis message is:\n%s\n\nHave a nice day!", 'tst'),
            ),
            'add_candidate_author_notice' => array(
                'title' => __('IT-Volunteer: a volunteer for your task appeared!', 'tst'),
                'text' => __("Hello, %s.\n\nSomeone is wishing to participate in your task: %s.\nThis volunteer is writing to you this: %s.\n\nYou can approve him if you wish on the task page: %s.\n\nHave a nice day!", 'tst'),
            ),
            'activate_account_notice' => array(
                'title' => __('ITVolunteer - activate your account', 'tst'),
                'text' => __("Greerings!\n\nYour registration is almost done. To complete it, please <a href='%s'>click here</a>.\nYour login is %s\n\nBest,\nITVolunteer", 'tst'),
                'test' => __('denisch_test_localization', 'tst'),
            ),
            'account_activated_notice' => array(
                'title' => __('it-volunteer - welcome!', 'tst'),
                'text' => __("Greetings!\n\nYour account is active now, welcome to it-volunteering ranks.\n\nYour login: <strong>%s</strong>\nPlease write down your pass to keep it safe. \nUse the following link to enter the site: %s\n\n\nBest,\nit-volunteer", 'tst'),
            ),
            'new_comment_task_author_notification' => array(
                'title' => __('ITVolunteer - new comment on your task!', 'tst'),
                'text' => __("Greetings!\n\nYour task was commented by someone.\n\nYou can read it on task page: %s\n\nBest,\nITVolunteer", 'tst'),
            ),
            'deadline_coming_author_notification' => array(
                'title' => __('ITVolunteer - your task in coming to its deadline!', 'tst'),
                'text' => __("Greetings!\n\nYour task deadline will come in one day from now. You can monitor task activity on its page: %s.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'password_reset_notice' => array(
                'title' => '', // Default email title is used
                'text' => __("Greetings!\n\nSomeone requested that the password be reset for the following account: %s\n\nIf this was a mistake, just ignore this email and nothing will happen. To reset your password, visit the following address: %s\n\nBest,\nITVolunteer", 'tst'),
            ),
            'message_added_notification' => array(
                'title' => __('it-volunteer - new message from contact form', 'tst'),
                'text' => __("Greetings!\n\nSomeone leaved a message on the contact form.\n\Page URL: %s\nName: %s\nEmail: %s\nMessage:\n%s\n\nBest,\nit-volunteer", 'tst'),
            ),                        
                        
            // news palceholders       
            'task_archive_soon_notif' => array(
                'title' => __('ITVolunteer - your task will be moved to archive soon!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYour task will be moved to archive soon because no doers have been approved for it.\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_no_doer_notif' => array(
                'title' => __('ITVolunteer - no doer has been approved for your task yet!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nWeek left but still no doer has been approved for your task.\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_status_changed' => array(
                'title' => __('ITVolunteer - linked task status changed!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} status changed!\n{{status_message}}\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_status_changed_doer' => array(
                'title' => __('ITVolunteer - linked task status changed!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} status changed!\n{{status_message}}\nTask page: {{task_link}}.\nDon't forget to check task status after close.\n\nBest,\nITVolunteer", 'tst'),
            ),
            #TODO: check triggers for the case
            'task_status_closed_doer' => array(
               'title' => __('ITVolunteer - linked task closed!', 'tst'),
               'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} closed!\nPlease go to task page and leave a review for the author: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            #TODO: check triggers for the case
            'task_status_closed_author' => array(
                'title' => __('ITVolunteer - linked task closed!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} closed!\nPlease go to task page and leave a review for the doer: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            #TODO: this should be moved to PUSH notif
            'thankyou_notification' => [
                'title' => __('ITVolunteer - thank you for your work!', 'tst'),
                'text' => __("Greetings, {{to_username}}!\n\nUser {{from_username}} said thank you for your work!\n\nBest,\nITVolunteer", 'tst'),
            ],
            'long_work_task_archive_soon' => [
                'title' => __('ITVolunteer - long work on task with no result!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask is in work for {{days_in_status}} days, but still no result. It will be moved to archive soon!\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ],
            'too_much_thankyou' => [
                'title' => __('ITVolunteer - too much thank you clicked!', 'tst'),
                'text' => __("Hello!\n\nUser <a href=\"{{from_user_url}}\">{{from_username}}</a> said thank you to <a href=\"{{to_user_url}}\">{{to_username}}</a> more {{limit}} times!\n\nLast moment is {{last_moment}}\n\n", 'tst'),
            ],
            'you_have_been_blocked' => [
                'title' => __('ITVolunteer - your profile has been blocked!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYour profile on ITVolonteer has been blocked till {{block_till_date}}.\n\n<a href='{{block_info_url}}'>Why?</a>\n\nBest,\nITVolunteer", 'tst'),
            ],
            'you_have_been_unblocked' => [
                'title' => __('ITVolunteer - your profile has been unblocked!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYour profile on ITVolonteer has been unblocked and active again.\n\n<a href='{{block_info_url}}'>Learn more about blocking reasons</a>\n\nBest,\nITVolunteer", 'tst'),
            ],
            'consult_needed_author_notification' => [
                'title' => __('itv_email_test_consult_needed_notification_subject', 'tst'),
                'text' => __('itv_email_test_consult_needed_notification', 'tst'),
            ],
		);
        
        // atvetka
        $this->email_templates_atvetka_style = array(
            'approve_candidate_doer_notice' => array(
                'title' => __('IT-Volunteer: you have been approved as participant!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYou have been approved to participate in task: {{task_link}}.\n\nYou can contact the task author for details with email: <a href='mailto:{{author_email}}'>{{author_email}}</a> or in some other ways (see <a href='{{author_profile_url}}'>author's profile</a>).\n\nHave a nice day!", 'tst'),
            ),
            'approve_candidate_author_notice' => array(
                'title' => __('IT-Volunteer: participant approved!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYou have approved some volunteer to participate in task: {{task_link}}.\n\nYou can contact the task doer for details with email: <a href='mailto:{{doer_email}}'>{{doer_email}}</a> or in some other ways (see <a href='{{doer_profile_url}}'>doer's profile</a>).\n\nHave a nice day!", 'tst'),
            ),
            'refuse_candidate_doer_notice' => array(
                'title' => __('IT-Volunteer: you have been disapproved as participant', 'tst'),
                'text' => __("Hello, {{username}}.\n\nYou have been disapproved to participate in task: {{task_link}}.\n\nHave a nice day!", 'tst'),
            ),
            'refuse_candidate_author_notice' => array(
                'title' => __('IT-Volunteer: a volunteer for your task removed himself!', 'tst'),
                'text' => __("Hello, {{username}}.\n\nSomeone has been removed himself from a volunteers for your task: {{task_link}}.\n\nHis message is:\n{{message}}\n\nHave a nice day!", 'tst'),
            ),
            'add_candidate_author_notice' => array(
                'title' => __('IT-Volunteer: a volunteer for your task appeared!', 'tst'),
                'text' => __("Hello, {{username}}.\n\nSomeone is wishing to participate in your task: {{task_link}}.\nThis volunteer is writing to you this: {{message}}.\n\nYou can approve him if you wish on the task <a href=\"{{task_url}}\">page</a>.\n\nHave a nice day!", 'tst'),
            ),
            'activate_account_notice' => array(
                'title' => __('ITVolunteer - activate your account', 'tst'),
                'text' => __("Greerings!\n\nYour registration is almost done. To complete it, please <a href='{{complete_reg_url}}'>click here</a>.\nYour login is {{login}}\n\nBest,\nITVolunteer", 'tst'),
                'test' => __('denisch_test_localization', 'tst'),
            ),
            'account_activated_notice' => array(
                'title' => __('it-volunteer - welcome!', 'tst'),
                'text' => __("Greetings!\n\nYour account is active now, welcome to it-volunteering ranks.\n\nYour login: <strong>{{login}}</strong>\nPlease write down your pass to keep it safe. \nUse the following link to enter the site: {{activation_url}}\n\n\nBest,\nit-volunteer", 'tst'),
            ),
            'new_comment_task_author_notification' => array(
                'title' => __('ITVolunteer - new comment on your task!', 'tst'),
                'text' => __("Greetings!\n\nYour task was commented by someone.\n\nYou can read it on task page: {{task_url}}\n\nBest,\nITVolunteer", 'tst'),
            ),
            'deadline_coming_author_notification' => array(
                'title' => __('ITVolunteer - your task in coming to its deadline!', 'tst'),
                'text' => __("Greetings!\n\nYour task deadline will come in one day from now. You can monitor task activity on its page: {{task_url}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'deadline_coming_doer_notification' => array(
                'title' => __('ITVolunteer - task deadline is near!', 'tst'),
                'text' => __("Greetings!\n\nThe task you are participate in has a deadline coming in one day from now. You can review the task on its page: {{task_url}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
//             'password_reset_notice' => array(
//                 'title' => '', // Default email title is used
//                 'text' => __("Greetings!\n\nSomeone requested that the password be reset for the following account: {{login}}\n\nIf this was a mistake, just ignore this email and nothing will happen. To reset your password, visit the following address: {{reset_password_url}}\n\nBest,\nITVolunteer", 'tst'),
//             ),
            'message_added_notification' => array(
                'title' => __('it-volunteer - new message from contact form', 'tst'),
                'text' => __("Greetings!\n\nSomeone leaved a message on the contact form.\n\Page URL: {{page_url}}\nName: {{name}}\nEmail: {{email}}\nMessage:\n{{message}}\n\nBest,\nit-volunteer", 'tst'),
            ),
            'thankyou_notification' => [
                'title' => __('ITVolunteer - thank you for your work!', 'tst'),
                'text' => __("Greetings, {{to_username}}!\n\nUser {{from_username}} said thank you for your work!\n\nBest,\nITVolunteer", 'tst'),
            ],
            'task_no_doer_notif' => array(
                'title' => __('ITVolunteer - no doer has been approved for your task yet!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nWeek left but still no doer has been approved for your task.\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_status_changed' => array(
                'title' => __('ITVolunteer - linked task status changed!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} status changed!\n{{status_message}}\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_status_changed_doer' => array(
                'title' => __('ITVolunteer - linked task status changed!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} status changed!\n{{status_message}}\nTask page: {{task_link}}.\nDon't forget to check task status after close.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_status_closed_doer' => array(
               'title' => __('ITVolunteer - linked task closed!', 'tst'),
               'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} closed!\nPlease go to task page and leave a review for the author: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_status_closed_author' => array(
                'title' => __('ITVolunteer - linked task closed!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask {{task_title}} closed!\nPlease go to task page and leave a review for the doer: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'task_archive_soon_notif' => array(
                'title' => __('ITVolunteer - your task will be moved to archive soon!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYour task will be moved to archive soon because no doers have been approved for it.\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ),
            'long_work_task_archive_soon' => [
                'title' => __('ITVolunteer - long work on task with no result!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nTask is in work for {{days_in_status}} days, but still no result. It will be moved to archive soon!\nTask page: {{task_link}}.\n\nBest,\nITVolunteer", 'tst'),
            ],
            'you_have_been_blocked' => [
                'title' => __('ITVolunteer - your profile has been blocked!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYour profile on ITVolonteer has been blocked till {{block_till_date}}.\n\n<a href='{{block_info_url}}'>Why?</a>\n\nBest,\nITVolunteer", 'tst'),
            ],
            'you_have_been_unblocked' => [
                'title' => __('ITVolunteer - your profile has been unblocked!', 'tst'),
                'text' => __("Greetings, {{username}}!\n\nYour profile on ITVolonteer has been unblocked and active again.\n\n<a href='{{block_info_url}}'>Learn more about blocking reasons</a>\n\nBest,\nITVolunteer", 'tst'),
            ],
            'consult_needed_author_notification' => [
                'title' => __('itv_email_test_consult_needed_notification_subject', 'tst'),
                'text' => __('itv_email_test_consult_needed_notification', 'tst'),
            ],
            # new 
            'your_task_declined' => [
                'title' => __('ITVolunteer - your task has been declined by admin', 'tst'),
                'text' => __('Greetings, {username}!\n\nYour task <a href="{task_url}">{task_title}</a> on ITVolonteer has been declined by admin', 'tst'),
            ],
            'new_tasks_subscription' => [
                'title' => __('ITVolunteer - new tasks according to your interests', 'tst'),
                'text' => __('Greetings, {username}!\n\nWe have made for you a selection of new tasks from non-commercial projects. They need professional help. See what tasks you are interested in responding to:\n{task_list}\n\nYou get this collection earlier than other specialists. Look and be the first to respond.', 'tst'),
            ],
        );
        
    }
    
    public static function instance() {
        if (ItvEmailTemplates::$_instance == NULL) {
            ItvEmailTemplates::$_instance = new ItvEmailTemplates ();
        }
        return ItvEmailTemplates::$_instance;
    }
    
    public function get_text($template_name) {
        return $this->get_some ( $template_name, 'text' );
    }
    
    public function get_title($template_name) {
        return $this->get_some ( $template_name, 'title' );
    }
    
    public function get_all_email_templates() {
        return array_merge($this->_email_templates, $this->email_templates_atvetka_style);
    }
    
    private function get_some($template_name, $what) {
        return isset ( $this->_email_templates [$template_name] [$what] ) ? $this->_email_templates [$template_name] [$what] : '';
    }
}