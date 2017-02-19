FROM php:7.1-alpine
MAINTAINER Alejandro Celaya <alejandro@alejandrocelaya.com>

RUN apk update

# Install common php extensions
RUN docker-php-ext-install iconv
RUN docker-php-ext-install mbstring
RUN docker-php-ext-install calendar

RUN apk add --no-cache --virtual icu-dev
RUN docker-php-ext-install intl

RUN apk add --no-cache --virtual zlib-dev
RUN docker-php-ext-install zip

RUN apk add --no-cache --virtual libpng-dev
RUN docker-php-ext-install gd

# Install composer
RUN php -r "readfile('https://getcomposer.org/installer');" | php
RUN chmod +x composer.phar
RUN mv composer.phar /usr/local/bin/composer

CMD cd /home/ac_blog/www && \
    composer update && \
    composer up;
