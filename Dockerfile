FROM node:23.0-alpine as node
COPY . /blog
RUN cd /blog && \
    npm ci && \
    npm run build

FROM nginx:1.27.2-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY --from=node /blog/build /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
