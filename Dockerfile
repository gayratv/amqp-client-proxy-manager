FROM node:18
WORKDIR /node/
#ADD ./dist-es/index.mjs .env ./*.json ./
ADD ./dist-es/index.mjs ./*.json ./

RUN apt-get update && apt-get install iputils-ping -y && apt-get install bash -y && npm ci --omit=dev
#RUN #apt-get update && apt-get upgrade -y && npm ci --omit=dev

#RUN apk update
#RUN apk add curl bash && npm ci --production
#RUN npm ci --omit=dev
USER node
# приложение слушает порт 3020
#EXPOSE 3020
#CMD ["sh"]
#CMD ["sleep", "infinity"]
CMD ["node", "index.mjs"]
