FROM wordpress:5.4.2-php7.4-fpm
RUN apt update
RUN apt install -y nano
RUN apt install -y nginx
RUN apt install -y procps
RUN apt install -y vim
RUN apt install -y npm

RUN useradd itv
RUN usermod -a -G itv itv

COPY tep-itv.dench.conf /etc/nginx/conf.d/default.conf
COPY start.sh /site/
#RUN cat /etc/nginx/sites-enabled/tep-itv.dench.conf >> /etc/nginx/conf.d/default.conf
#RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY www.conf /usr/local/etc/php-fpm.d/
COPY zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
RUN echo "127.0.0.1    v1.tep-itv.dench" >> /etc/hosts
RUN cd /tmp && curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN chmod +x /tmp/wp-cli.phar
RUN mv /tmp/wp-cli.phar /usr/local/bin/wp

CMD ["/bin/bash", "/site/start.sh"]