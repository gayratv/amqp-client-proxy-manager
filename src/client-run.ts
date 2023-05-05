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
    // log.debug(' var i', i);
    const p1: GetProxyReturn = await cli.sendRequestAndResieveAnswer<ParamGetProxy, GetProxyReturn>(
      proxyRMQnames.getproxy,
      {
        leasedTime: 3_000,
      },
    );

    log.info(' Клиент получил ответ сервера', p1.userData.uniqueKey);

    // вернуть proxy в пул после использования
    await delay(1_000);
    await cli.sendRequestOnly<ParamReturnProxy>(proxyRMQnames.returnProxy, { uniqueKey: p1.userData.uniqueKey });

    // await cli.sendRequestOnly<ParamGetProxy>({ leasedTime: 3_000 });
  }
  log.info('Запросы на сервер отправлены');
}

await clientRun();
