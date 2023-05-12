# RabbitMQ proxy manager

Данный модуль реализует request/response pattern

Много клиентов шлют параллельные запросы менеджеру.

Для избежания блокировок запросы помещаются в очередь RabbitMQ и в последующем обрабатываются по одному для избежания блокировок.

Каждый клиент на своей стороне создает очередь с уникальным именем в которую обработчик помещает ответы. 

На клиенте очередь создается с параметром autodelete

Для проверки работоспособности Вы можете поднять образ RQM на локальной машине 

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management

Запускается образ RMQ со встроенным web интерфейсом, для доступа используйте ссылку
(guest/guest credential)

http://localhost:15672

### Настройки
В директории config - настройки имен очередей

RMQ hots описан в .env файле  process.env.RMQ_HOST

соединение создается одно на клиента src/rmq-request-responce/lib/rmq-connection.ts

### Запуск локально

docker build -t amqp-server .

docker-compose build
docker compose up -d
docker compose down

docker run --env-file ./env.list ubuntu bash
