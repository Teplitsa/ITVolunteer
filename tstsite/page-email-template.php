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

<h4><a href="https://itv.te-st.ru/">Выбрать волонтёра</a></h4>

<h5>Это первая задача?
<a href="http://te-st.ru/">Узнайте рецепт успешной задачи!</a>
</h5>

<h6>Мы с вами всегда на связи и готовы помочь</h6>

<?php 
    $message_title = "Новый отклик на задачу";
    $message_content = ob_get_clean();    
    include(get_template_directory() . '/mail/message_template.php');
?>