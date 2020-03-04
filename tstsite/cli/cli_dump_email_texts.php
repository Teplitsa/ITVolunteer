<?php

try {
	include('cli_common.php');
   
	foreach(\ItvEmailTemplates::instance()->get_all_email_templates() as $email_template) {
	    echo "Тема:\n";
	    echo $email_template['title'] . "\n\n";
	    echo "Текст:\n";
	    echo $email_template['text'] . "\n\n\n\n";
	}
	
}
catch (ItvNotCLIRunException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (ItvCLIHostNotSetException $ex) {
	echo $ex->getMessage() . "\n";
}
catch (Exception $ex) {
	echo $ex;
}
