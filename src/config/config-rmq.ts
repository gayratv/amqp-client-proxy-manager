// время ожидания сервера на запрос getProxy
export const TIME_WAIT_PROXY_ANSWER = 15_000;

export const proxyRMQnames = {
  exchange: 'proxy.exchange',

  // имена очередей для запросов
  getproxy: 'proxy.getproxy',
  returnProxy: 'proxy.returnProxy',
  printProxyQueue: 'proxy.printProxyQueue',
  refillProxy: 'proxy.refillProxy',
};
