FROM nginx:1.15.9-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"

ADD . ./blog

RUN cd ./blog && \

    # Install node and PHP
    apk add --no-cache nodejs && \
    apk add --no-cache npm && \
    apk add --no-cache php7 && \
    apk add --no-cache php7-json && \
    apk add --no-cache php7-iconv && \
    apk add --no-cache php7-phar && \
    apk add --no-cache php7-openssl && \
    apk add --no-cache php7-dom && \
    apk add --no-cache php7-mbstring && \

    # Install composer
    wget -q -O - http://getcomposer.org/installer | php && \
    chmod +x composer.phar && \

    # Install dependencies and build project
    npm install && \
    ./composer.phar install && \
    ./vendor/bin/spress site:build --env=pro && \
    ./node_modules/.bin/grunt && \

    # Move build contents to document root and delete the rest
    cd .. && \
    rm -r /usr/share/nginx/html/* && \
    mv ./blog/build/* /usr/share/nginx/html && \
    ./blog/composer.phar clear-cache && \
    rm -r ./blog && \

    # Delete and uninstall build tools
    npm cache clean --force && \
    apk del nodejs && \
    apk del npm && \
    apk del php7 && \
    apk del php7-json && \
    apk del php7-iconv && \
    apk del php7-phar && \
    apk del php7-openssl && \
    apk del php7-dom && \
    apk del php7-mbstring
