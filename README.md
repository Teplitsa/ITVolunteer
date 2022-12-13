# [it-волонтёр](https://itvist.org) #

«IT-волонтёр» – это онлайн-платформа обмена знаниями и навыками в сфере информационных технологий, созданная для помощи некоммерческим проектам.

Основная аудитория системы — сотрудники НКО и общественные инициативы, желающие организовать собственную независимую площадку для организации it-волонтёрства.

Описание работы системы:

https://www.youtube.com/watch?v=D32OZIhoC6E

Данный дистрибутив позоволяет не только создать копию IT-волонтёра, но также позволяет создать подобную платформу для обмена любыми pro bono услугами (например, услуги юриста, психолога, и т.д.). Мы будем рады, если вы будете создавать на основе IT-волонтёра ваши собственные проекты взаимной помощи. 

Актуальная версия системы работает по протоколам HTTP или HTTPS, в зависимости от настроек вашего сервера.

* Система является надстройкой над CMS WordPress. Она устанавливается как тема (theme) и требует минимум настроек.

**Официальный сайт платформы:** [itvist.org](https://itvist.org/)
![](https://itvist.org/wp-content/uploads/homescreen1.png)


**Внимание:** для разворачивания системы необходим действующий сайт на базе CMS WordPress (версии не ниже 3.5).

**Основные функции**

* Простая регистрация пользователей, вне зависимости от их статуса заказчиков и волонтёров.
* Неограниченные возможности по созданию задач любым пользователем системы.
* Помощь в коммуникации между заказчиками и волонтёрами.
* Отслеживание актуального состояния каждой задачи с помощью извещений на эл. почту.
* Редактирование текстов, описывающих ваш проект.


## Установка ##

Для установки системы необходимы:
* Действующий сайт на базе CMS WordPress версии не ниже 3.5, не содержащий актуального контента или чистая установка CMS WordPress версии не ниже 3.5.
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
* Импортировать в БД сайта дамп с базовыми настройками системы, прилагаемый к настоящему дистрибутиву. *Внимание!* Префикс таблиц в БД сайта должен совпадать с префиксом таблиц в файле дампа (по умолчанию, «str_»). В случае возникновения конфликтов нужно удалить старые таблицы из БД.
* После установки базового дампа нужно в БД заменить адрес официального сайта на адрес вашего сайта. Сделать это можно вручную или при помощи утилиты https://interconnectit.com/products/search-and-replace-for-wordpress-databases/
  Меняем https://itvist.org на https://ваш_сайт.ru или на http://ваш_сайт.ru, в зависимости от протокола, который вы хотите поддерживать.
* После установки дампа базового состояния БД системы доступ в административную панель будет таким:
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
    
Помощь и поддержка: Теплица социальных технологий берет на себя поддержку ИТ-волонтёра до мая 2015-го года (и, возможно, далее). Если у вас есть вопросы по работе, установке или кастомизации системы, обратитесь за поддержкой по почте help@te-st.org.

Если вам нужна помощь волонтеров в установке и настройке - создайте задачу на https://itvist.org
