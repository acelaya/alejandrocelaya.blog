# Build blog
FROM composer:2 as composer
COPY . /blog
RUN cd /blog && composer install && ./vendor/bin/spress site:build --env=pro

# Process node tasks
FROM node:10.15.3-alpine as node
COPY --from=composer /blog /blog
RUN cd /blog && npm install && ./node_modules/.bin/grunt

# Expose static content with nginx
FROM nginx:1.19.6-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html
COPY --from=node /blog/build /usr/share/nginx/html
