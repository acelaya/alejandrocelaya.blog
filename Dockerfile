FROM node:20.8-alpine as node
COPY . /blog
RUN cd /blog && \
    npm install --force && \
    npm run export

FROM nginx:1.25-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY --from=node /blog/out /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
