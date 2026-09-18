FROM nginx:1.27-alpine

# Enforce non-root user (UID 10001: cmsrunner)
RUN addgroup -g 10001 -S cmsrunner && \
    adduser -u 10001 -D -S -G cmsrunner cmsrunner && \
    touch /var/run/nginx.pid && \
    chown -R cmsrunner:cmsrunner /var/run/nginx.pid /var/cache/nginx /var/log/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY src/ /usr/share/nginx/html/

USER 10001
EXPOSE 80

HEALTHCHECK --interval=5s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
