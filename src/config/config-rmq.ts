// время ожидания сервера на запрос getProxy
import process from 'process';

export const TIME_WAIT_PROXY_ANSWER = 15_000;

/*
  RMQ hots описан в .env файле  process.env.RMQ_HOST
  соединение создается одно на клиента src/rmq-request-responce/lib/rmq-connection.ts

 */

export const proxyRMQnames = {
  exchange: 'proxy.exchange',

  // имена очередей для запросов
  getproxy: 'proxy.getproxy',
  returnProxy: 'proxy.returnProxy',
  printProxyQueue: 'proxy.printProxyQueue',
  refillProxy: 'proxy.refillProxy',
};
