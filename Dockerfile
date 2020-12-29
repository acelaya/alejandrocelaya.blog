FROM node:14.15-alpine as node
COPY . /blog
RUN cd /blog && \
    npm install && \
    npm run export

# Expose static content with nginx
FROM nginx:1.19-alpine
LABEL maintainer="Alejandro Celaya <alejandro@alejandrocelaya.com>"
RUN rm -r /usr/share/nginx/html
COPY --from=node /blog/out /usr/share/nginx/html
