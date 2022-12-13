<?php
ob_start();
?>	

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

<h4><a href="https://itivist.org/">Выбрать волонтёра</a></h4>

<h5>Это первая задача?
<a href="http://te-st.org/">Узнайте рецепт успешной задачи!</a>
</h5>

<h6>Мы с вами всегда на связи и готовы помочь</h6>

<?php 
    $message_title = "Новый отклик на задачу";
    $message_content = ob_get_clean();
?>

<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title><?php echo $message_title;?></title>
  </head>
  <body class="">

  <?php include(get_template_directory() . '/mail/message_template.php');?>
  	  
  </body>
</html>
