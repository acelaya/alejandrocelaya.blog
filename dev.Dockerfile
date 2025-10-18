FROM node:25.0-alpine

# Install tini
RUN apk add --no-cache tini
# Set tini as the entry point, as node does not properly handle signals
ENTRYPOINT ["/sbin/tini", "--"]
