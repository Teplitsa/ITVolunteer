<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title><?php echo $message_title;?></title>
    
    <style>
        <?php include(get_template_directory() . "/assets_email/css/email-main.css");?>
    </style>
    
  </head>
  <body class="">
  	<div class="svg-sprite"><?php include(get_template_directory() . "/assets_email/img/sprite.svg");?></div>  	
  	
  	<div class="header">
      	<svg class="itv-logo">
    		<use xlink:href="#pic-logo-itv" />
    	</svg>
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
  			<a href="#" class="btn danger btn-build-team">Собрать команду</a>
  		</div>
  		<a href="https://te-st.ru">
          	<svg class="teplitsa-logo">
        		<use xlink:href="#pic-logo-teplitsa" />
        	</svg>
    	</a>
    	<div class="owner-info">
    		<a href="https://itv.te-st.ru">Платформа IT-Волонтер — проект Теплицы социальных технологий</a>
    	</div>
  	</div>
  	  
  </body>
</html>
