FROM wordpress:5.6-php7.4-fpm

RUN apt update
RUN apt install -y nano
RUN apt install -y procps
RUN apt install -y vim
RUN apt install -y npm

RUN useradd itv
RUN usermod -a -G itv itv

COPY www.conf /usr/local/etc/php-fpm.d/
COPY zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
RUN cd /tmp && curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
RUN chmod +x /tmp/wp-cli.phar
RUN mv /tmp/wp-cli.phar /usr/local/bin/wp
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN pecl install mongodb
RUN echo "extension=mongodb.so" > /usr/local/etc/php/conf.d/20-mongodb.ini
COPY start.sh /site/

#CMD ["php-fpm"]
CMD ["/bin/bash", "/site/start.sh"]
