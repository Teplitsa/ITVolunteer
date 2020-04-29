<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Simple Transactional Email</title>
    
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
	
        <img class="alignnone size-full wp-image-7192" src="http://tep-itv.dench/wp-content/uploads/2020/04/pic-email-check.png" alt="" width="64" height="64" />
        
        <h1>Новый отклик на задачу</h1>
        
        <h2>Добрый день, {username}!</h2>
        
        <p></p>
        
        <p>Один из волонтёров хочет помочь вам<br />выполнить задачу:</p>
        
        <p><strong>{task_url}</strong></p>
        
        <p></p>
        
        <p>Что дальше?</p>
        
        <p>Посмотрите портфолио, отзывы от других авторов и утвердите кандидатуру:</p>
        
        <p><strong>Александра Гусева</strong></p>
        
        <p>Вы в шаге от успешного завершения задачи!</p>
        
        <h4><a href="https://itv.te-st.ru/">Выбрать волонтёра</a></h4>
        
        <h5>Это первая задача?
        <a href="http://te-st.ru/">Узнайте рецепт успешной задачи!</a>
        </h5>
        
        <h6>Мы с вами всегда на связи и готовы помочь</h6>
	
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
