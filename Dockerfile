# Build blog
FROM composer:1.8.4 as composer
COPY . /blog
RUN cd /blog && ./composer.phar install && ./vendor/bin/spress site:build --env=pro

# Process node tasks
FROM node:10.15.2-alpine as node
COPY --from=composer /blog/build /blog
RUN cd /blog && npm install && ./node_modules/.bin/grunt

# Expose static content with nginx
FROM nginx:1.15.9-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html/*
COPY --from=node /blog/* /usr/share/nginx/html
