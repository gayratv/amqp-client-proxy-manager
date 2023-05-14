export const TIME_WAIT_PROXY_ANSWER = 15_000;
export const TIME_LEASED_PROXY_DEFAULT = 3_000;
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
//# sourceMappingURL=config-rmq.js.map