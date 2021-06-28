<?php

add_filter( 'password_change_email', '\ITV\models\Mail::replace_password_change_email', 10, 3 );
add_filter( 'retrieve_password_message', '\ITV\models\Mail::replace_retrieve_password_email_message', 10, 4 );
add_filter( 'retrieve_password_title', '\ITV\models\Mail::replace_retrieve_password_email_subject', 10, 3 );
