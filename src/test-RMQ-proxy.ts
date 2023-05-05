import { RMQ_proxyClientQuery } from './rmq-request-responce/clients/clients.js';
import { proxyRMQnames } from './config/config-rmq.js';
import { initProxyPool } from './rmq-request-responce/workers/resource-manager-instance.js';
import { NLog } from 'tslog-fork';
import { RMQ_serverQuery } from './rmq-request-responce/server/server.js';
import { getProxy, returnProxy, workerBase } from './rmq-request-responce/workers/worker.js';
import { GetProxyReturn, ParamGetProxy } from './rmq-request-responce/types/types.js';

const log = NLog.getInstance();

async function main() {
  await initProxyPool();

  const srv1 = await RMQ_serverQuery.createRMQ_serverQuery(
    proxyRMQnames.exchange,
    proxyRMQnames.getproxy,
    proxyRMQnames.getproxy,
    workerBase,
    getProxy,
  );
  // второй метод - returnProxy
  srv1.addQueues(proxyRMQnames.returnProxy, workerBase, returnProxy);

  /*
   * Клиент
   */
  const cli = await RMQ_proxyClientQuery.createRMQ_clientQuery(
    proxyRMQnames.exchange,
    proxyRMQnames.getproxy,
    proxyRMQnames.getproxy,
  );

  // данные пользователя передаются в объекте {params : ....}
  for (let i = 0; i < 4; i++) {
    // log.debug(' var i', i);
    // const p1: GetProxyReturn = await cli.sendRequest<ParamGetProxy, GetProxyReturn>({ leasedTime: 3_000 });
    await cli.sendRequestOnly<ParamGetProxy>({ leasedTime: 3_000 });
    // log.info(' Клиент получил ответ сервера', p1);

    // log.info(' Клиент получил ответ сервера', p1.userData.uniqueKey);
  }
  log.info('Запросы на сервер отправлены');
}

await main();
