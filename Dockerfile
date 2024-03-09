FROM node:21.7-alpine as node
COPY . /blog
RUN cd /blog && \
    npm ci && \
    npm run build

FROM nginx:1.25.4-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html && rm /etc/nginx/conf.d/default.conf
COPY --from=node /blog/build /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
