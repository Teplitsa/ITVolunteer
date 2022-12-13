<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>it-волонтёр</title>
    <style><?php include(get_template_directory() . "/assets_email/css/email-main.css");?></style>
</head>

<body>

<div class="body-inner">

    <div class="header">
    	<img class="itv-logo" src="<?php echo get_template_directory_uri() . "/assets_email/img/pic-logo-itv_redesigned.png";?>" width="161" height="37" />
    </div>
    
    <div class="content">
    
    <?php echo $message_content;?>
    
    </div>
    
    <div class="footer">
    	<div class="join-community">
    		<div>Пригласите коллег и помогайте своей командой!</div> 
    		<div>Включитесь вместе в решение интересных кейсов, получайте больший эффект от помощи.</div>
    	</div>
    	<div class="build-team">
    		<a href="https://itivist.org" class="btn danger btn-build-team">Собрать команду</a>
    	</div>
    	<a href="https://te-st.org">
    		<img class="teplitsa-logo" src="<?php echo get_template_directory_uri() . "/assets_email/img/pic-logo-teplitsa.png";?>" />
    	</a>
    	<div class="owner-info">
    		<a href="https://itivist.org">Платформа IT-Волонтер — проект Теплицы социальных технологий</a>
    	</div>
    </div>

</div>

</body>


</html>