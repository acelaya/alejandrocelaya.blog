FROM node:16.14-alpine as node
COPY . /blog
RUN cd /blog && \
    npm install --legacy-peer-deps && \
    npm run export

FROM nginx:1.21-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY --from=node /blog/out /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
