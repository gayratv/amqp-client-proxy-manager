import { RMQ_proxyClientQuery } from './rmq-request-responce/clients/clients.js';
import { proxyRMQnames } from './config/config-rmq.js';
import { initProxyPool } from './rmq-request-responce/workers/resource-manager-instance.js';
import { NLog } from 'tslog-fork';
import { RMQ_serverQuery } from './rmq-request-responce/server/server.js';
import { getProxy, returnProxy, workerBase } from './rmq-request-responce/workers/worker-get-proxy.js';
import { ParamGetProxy } from './rmq-request-responce/types/types.js';

const log = NLog.getInstance();

async function serverRun() {
  await initProxyPool();

  const srv1 = await RMQ_serverQuery.createRMQ_serverQuery(
    proxyRMQnames.exchange,
    proxyRMQnames.getproxy,
    proxyRMQnames.getproxy,
    workerBase,
    getProxy,
  );
  // второй метод - returnProxy
  // srv1.addQueues(proxyRMQnames.returnProxy, workerBase, returnProxy);
}

await serverRun();
