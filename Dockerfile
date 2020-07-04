FROM node:12-alpine

RUN mkdir -p /usr/src/uwu-bot

WORKDIR /usr/src/uwu-bot

COPY . .

RUN yarn install

EXPOSE 6868

CMD ["yarn", "start"]