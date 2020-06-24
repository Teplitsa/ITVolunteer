FROM wordpress:5.3.2-php7.2-fpm
RUN apt update
RUN apt install -y nano
RUN apt install -y nginx
RUN apt install -y procps

RUN useradd itv
RUN usermod -a -G itv itv

COPY tep-itv.dench.conf /etc/nginx/sites-enabled/
COPY start.sh /site/
RUN cat /etc/nginx/sites-enabled/tep-itv.dench.conf >> /etc/nginx/conf.d/default.conf
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY www.conf /usr/local/etc/php-fpm.d/
COPY zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

RUN usermod -a -G itv www-data

CMD ["/bin/bash", "/site/start.sh"]