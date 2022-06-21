FROM node:alpine

WORKDIR /usr/app

ENV PATH /app/node_modules/.bin:$PATH

RUN apk update && apk add bash

COPY package*.json ./

COPY . .

RUN ls -la

EXPOSE 3000

COPY ./docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/bin/bash", "/docker-entrypoint.sh"]

#CMD ["tail", "-f", "/dev/null"]