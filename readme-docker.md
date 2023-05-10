### Best parctic
https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

### Memory
По умолчанию любой контейнер Docker может потреблять максимальное количество аппаратных средств, таких как процессор и оперативная память. Если вы запускаете несколько контейнеров на одном хосте, вам следует ограничить объем памяти, который они могут потреблять.

-m "300M" --memory-swap "1G"

### Пример запуска
~~~
$ docker run \
--init \
-e "NODE_ENV=production" \
-u "node" \
-m "300M" --memory-swap "1G" \
-w "/home/node/app" \
--name "my-nodejs-app" \
node [script]
~~~


docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

docker network create --scope=swarm --attachable -d overlay my-multihost-network

--ingress		Create swarm routing-mesh network

# Docker

docker image prune -a -f                         Удалить все неиспользуемые Docker-образы:
docker rmi -f $(docker images -q)                Принудительно удалить все Docker-образы
docker container prune -f                        Удалить все остановленные (неиспользуемые) Docker-контейнеры:
docker rm -f $(docker ps -a -q)                  Принудительно удалить все Docker-контейнеры, включая запущенные контейнеры:


rimraf ./build && tsc
docker container prune -f && docker image prune -a -f && docker build -t rmq-test .


docker run -it rmq-test

docker-compose down
docker-compose build
docker-compose up

docker-compose -f docker-compose.yml -p rmq-manager up -d
