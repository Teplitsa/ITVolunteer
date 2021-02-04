FROM debian:buster

RUN apt-get update
RUN apt-get install -y nginx

COPY custom.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
