import { RMQ_proxyClientQuery } from './rmq-request-responce/clients/clients.js';
import { proxyRMQnames } from './config/config-rmq.js';
import { NLog } from 'tslog-fork';
import { GetProxyReturn, ParamGetProxy, ParamReturnProxy } from './rmq-request-responce/types/types.js';
import { delay } from './helpers/common.js';

const log = NLog.getInstance();

async function clientRun() {
  /*
   * Клиент
   */
  const cli = await RMQ_proxyClientQuery.createRMQ_clientQuery(
    proxyRMQnames.exchange,
    proxyRMQnames.getproxy,
    proxyRMQnames.getproxy,
  );

  // данные пользователя передаются в объекте {params : ....}
  for (let i = 0; i < 10; i++) {
    await cli.sendRequestOnly<ParamGetProxy>(proxyRMQnames.getproxy, { leasedTime: 3_000 });
    await delay(1_000);
    // log.info(' Клиент получил ответ сервера', p1.userData.uniqueKey);
  }
  log.info('Запросы на сервер отправлены');
}

await clientRun();
