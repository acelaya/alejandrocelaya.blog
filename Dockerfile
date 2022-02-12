FROM node:14.17-alpine as node
COPY . /blog
RUN cd /blog && \
    npm install && \
    npm run export

FROM nginx:1.21-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY --from=node /blog/out /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
