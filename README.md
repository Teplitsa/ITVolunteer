# [it-волонтёр](https://itv.te-st.ru) #

«IT-волонтёр» – это онлайн-платформа обмена знаниями и навыками в сфере информационных технологий, созданная для помощи некоммерческим проектам.

Основная аудитория системы — сотрудники НКО и общественные инициативы, желающие организовать собственную независимую площадку для организации it-волонтёрства.

Описание работы системы:

https://www.youtube.com/watch?v=D32OZIhoC6E

Данный дистрибутив позоволяет не только создать копию IT-волонтёра, но также позволяет создать подобную платформу для обмена любыми pro bono услугами (например, услуги юриста, психолога, и т.д.). Мы будем рады, если вы будете создавать на основе IT-волонтёра ваши собственные проекты взаимной помощи. 

Актуальная версия системы работает по протоколам HTTP или HTTPS, в зависимости от настроек вашего сервера.

* Система является надстройкой над CMS WordPress. Она устанавливается как тема (theme) и требует минимум настроек.

**Официальный сайт платформы:** [itv.te-st.ru](https://itv.te-st.ru/)
![](https://itv.te-st.ru/wp-content/uploads/homescreen1.png)


**Внимание:** для разворачивания системы необходим действующий сайт на базе CMS WordPress (версии не ниже 3.5).

**Основные функции**

* Простая регистрация пользователей, вне зависимости от их статуса заказчиков и волонтёров.
* Неограниченные возможности по созданию задач любым пользователем системы.
* Помощь в коммуникации между заказчиками и волонтёрами.
* Отслеживание актуального состояния каждой задачи с помощью извещений на эл. почту.
* Редактирование текстов, описывающих ваш проект.


## Установка ##

Для установки системы необходимы:
* Действующий сайт на базе CMS WordPress версии не ниже 3.5, не содержащий актуального контента или чистая установка CMS WordPress версии не ниже 3.5. *Внимание!* Префикс таблиц базы данных сайта должен быть «str_». Обязательно укажите его при установке WordPress.
* Доступ к этому сайту по FTP, а также к его БД (для инсталляции базовых данных системы).
* Установленные и активированные плагины актуальных версий: 
  * [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/), 
  * [Cyr to Lat Enhanced](https://wordpress.org/plugins/cyr3lat/),
  * [GD Custom Posts And Taxonomies Tools](https://wordpress.org/plugins/gd-taxonomies-tools/), 
  * [Posts 2 Posts](https://wordpress.org/plugins/posts-to-posts/),
  * [Post Views Counter](https://wordpress.org/plugins/post-views-counter/).

**Ход установки**

* Установить на сайт под управлением WordPress все вышеуказанные плагины. Настройки плагинов можно опустить. Плагины должны быть активированы.
* Закачать в папку /wp-content/themes/ содержимое настоящего дистрибутива (с заменой дублирующихся папок и файлов).
* Зайдите в админку и активируйте тему ITV.
* Проверьте установку: для этого перейдите на главную страницу сайта. На ней вы должны увидеть активную тему ИТВ и несколько задач, ожадиющих волонтеров, для демонстрации. Также должны быть доступны все страницы из меню "О проекте". Перейдите на каждую и убедитесь что все они открываются.
* Если при проверке на сайте возникают ошибки, вы не видете активных задач и страницы из меню "О проекте" выдают 404 ошибку, значит придется импортировать дамп с данными вручную. Сначада деактивируйте тему ITV, активировав любую другую тему. Далее следуйте инструкции импорта дампа. После импорта обязательно активируйте тему ITV.
* После успешной активации темы ITV доступ в административную панель будет таким:
  Имя пользователя: admin
  Пароль: 123123
  Обязательно смените пароль перед запуском вашего сайта!
* Если в папке, куда установлен WordPress, нет файла .htaccess, скопируйте туда .htaccess из этого дистрибутива.
  Если WordPress установлен не в корневаю папку, а например в папку sitefolder (https://site.ru/sitefolder/), то .htaccess придется изменить.
  Нужно раскомментировать строки
    #RewriteBase /sitefolder/ 
	#RewriteRule . /sitefolder/index.php [L]
  и заскомментировать строки
    RewriteBase /
	RewriteRule . /index.php [L]	
* Выполнить настройку базовых параметров сайта системы в разделе "Настройки" административной панели WordPress. Параметры, которые должны иметь определённые значения для корректного функционирования системы, перечислены ниже.
* Для подсчета статистики на сайте вам необходимо настроить запуск соответствующих скриптов через cron. Это можно сделать через SSH или панель управления хостингом. В cron нужно прописать следующие строки, предварительно заменив /FULL/PATH_TO_YOUR/SITE/DOCUMENT_ROOT/ на полный путь к папке, в которой лежит ваш сайт на WordPress, а YOURSITE.RU заменить на реальный домен вашего сайта, например itv.te-st.ru:

*/30    *       *       *       *       /usr/bin/php /FULL/PATH_TO_YOUR/SITE/DOCUMENT_ROOT/wp-content/themes/tstsite/cli_refresh_users_stats.php --host=YOURSITE.RU >> /tmp/itv.cron.refresh_users_stats.log 2>&1

45      22      *       *       *       /usr/bin/php /FULL/PATH_TO_YOUR/SITE/DOCUMENT_ROOT/wp-content/themes/tstsite/cli_archive_old_undone_tasks.php --host=YOURSITE.RU >> /tmp/itv.cron.archive_old_undone_tasks.log 2>&1

15      23      *       *       *       /usr/bin/php /FULL/PATH_TO_YOUR/SITE/DOCUMENT_ROOT/wp-content/themes/tstsite/cli_notify_tasks_owners.php --host=YOURSITE.RU >> /tmp/itv.cron.notify_tasks_owners.log 2>&1

25      23      *       *       *       /usr/bin/php /FULL/PATH_TO_YOUR/SITE/DOCUMENT_ROOT/wp-content/themes/tstsite/cli_refresh_tasks_stats_by_tags.php  --host=YOURSITE.RU >> /tmp/itv.cron.refresh_tasks_stats_by_tags.log 2>&1

00      10      *       *       3       /usr/bin/php /FULL/PATH_TO_YOUR/SITE/DOCUMENT_ROOT/wp-content/themes/tstsite/cli_send_weekly_stats_report.php --host=YOURSITE.RU >> /tmp/itv.cron.send_weekly_stats_report.log 2>&1

10      02      *       *       3       /usr/bin/php /FULL/PATH_TO_YOUR/SITE/DOCUMENT_ROOT/wp-content/themes/tstsite/cli_users_recalc_xp.php --host=YOURSITE.RU >> /tmp/itv.cron.users_recalc_xp.log 2>&1

Если путь к команде php отличается от /usr/bin/php, то укажите свой путь или команду без пути (просто php).

**Импорт дампа БД вручную**

* Импортировать в БД сайта дамп с базовыми настройками системы, прилагаемый к настоящему дистрибутиву. *Внимание!* Префикс таблиц в БД сайта должен совпадать с префиксом таблиц в файле дампа (по умолчанию, «str_»). В случае возникновения конфликтов нужно удалить старые таблицы из БД.
* После установки базового дампа нужно в БД заменить адрес официального сайта на адрес вашего сайта. Сделать это можно вручную или при помощи утилиты https://interconnectit.com/products/search-and-replace-for-wordpress-databases/
  Меняем https://itv.te-st.ru на https://ваш_сайт.ru или на http://ваш_сайт.ru, в зависимости от протокола, который вы хотите поддерживать.

**Параметры, необходимые для работы системы**

1. Подраздел "общие настройки":

  * Членство - чекбокс "любой может зарегистрироваться" не отмечен.
  * Роль нового пользователя: значение "подписчик".

2. Раздел "чтение":

  * На главной странице отображать - значение "статическую страницу".
  * Главная страница - значение "главная".
  * Страница записей - значение "новости".

3. Раздел "обсуждение":

  * Настройки для статьи по умолчанию - отмечен чекбокс "разрешить оставлять комментарии на новые статьи".
  * Другие настройки комментариев - отмечены чекбоксы "пользователи должны быть зарегистрированы и авторизованы для комментирования" и "разрешить древовидные (вложенные) комментарии глубиной..".

4. Раздел "медиафайлы":

  * Размер миниатюры - ширина 150 пикс., высота 150 пикс.
  * Обрезать миниатюру точно по размерам - чекбокс отмечен.
  * Средний размер - макс. ширина 640 пикс., макс. высота 900 пикс.
  * Крупный размер - макс. ширина 1024 пикс., макс. высота 1024 пикс.

5. Главное меню административной панели WordPress, разделы "произвольные поля" и "GD CPT Tools":

  * Все настройки задаются автоматически при инсталляции дампа базового состояния БД системы. Никаких изменений в настройках этих разделов не требуется.


## Тестирование ##

Автоматические тесты для [Selenium IDE](http://www.seleniumhq.org/projects/ide/) находятся в папке test. Все тесты объединины в серию itv-full-001.html. Этот набор запускается в IDE через функцию "Open Test Suite". Запускать рекомендуется со средней скоростью. Некоторые тесты можно запускать отдельно, например тест процесса регистрации или создания задачи. Некоторые тесты требуют предварительной подготовки и могут запускаться только в серии. Тестирование происходит на [тестовой версии ИТВ](http://testplugins.ngo2.ru/). [Selenium IDE](http://www.seleniumhq.org/projects/ide/) устанавливается как расширение для браузера Firefox.


## Помощь проекту ##

Мы очень ждем вашей помощи проекту. Вы можете помочь проекту следующими способами:

  * Добавить сообщение об ошибке или предложение по улучшению на GitHub.
  * Поделиться улучшениями кода, послав нам Pull Request.
  * Сделать перевод системы или оптимизировать его для вашей страны (перевод на англ. уже существует).
    
Помощь и поддержка: Теплица социальных технологий берет на себя поддержку ИТ-волонтёра до мая 2015-го года (и, возможно, далее). Если у вас есть вопросы по работе, установке или кастомизации системы, обратитесь за поддержкой по почте support@te-st.ru.

Если вам нужна помощь волонтеров в установке и настройке - создайте задачу на https://itv.te-st.ru
