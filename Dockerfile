FROM node:12-alpine

RUN mkdir -p /usr/src/uwu-bota

WORKDIR /usr/src/uwu-bota

COPY . .

RUN yarn install

EXPOSE 6868

CMD ["yarn", "start"]