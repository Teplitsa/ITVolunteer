<body><style><?php include(get_template_directory() . "/assets_email/css/email-main.css");?></style>

<div class="header">
	<img class="itv-logo" src="<?php echo get_template_directory_uri() . "/assets_email/img/pic-logo-itv.png";?>" />
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
		<img class="teplitsa-logo" src="<?php echo get_template_directory_uri() . "/assets_email/img/pic-logo-teplitsa.png";?>" />
	</a>
	<div class="owner-info">
		<a href="https://itv.te-st.ru">Платформа IT-Волонтер — проект Теплицы социальных технологий</a>
	</div>
</div>

</body>
