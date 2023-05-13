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
Для локального запускак предназначен файл docker-compose.yml

Запись
```
    env_file:
    - .env_server_local
```
Заставляет dcoker compose разместить в process.env переменные заданные в файле

```bash
docker compose up -d
```
```bash
docker compose down
```

### Полезные команды
Показать текущие переменные
```node --print 'process.env'```

docker build -t amqp-server .


docker run --env-file ./env.list ubuntu bash
