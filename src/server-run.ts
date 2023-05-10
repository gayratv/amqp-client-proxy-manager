import './helpers/dotenv-init.js';
import { proxyRMQnames } from './config/config-rmq.js';
import { initProxyPool } from './rmq-request-responce/workers/resource-manager-instance.js';
import { NLog } from 'tslog-fork';
import { RMQ_serverQuery } from './rmq-request-responce/server/server.js';
import { getProxy, returnProxy, workerBase } from './rmq-request-responce/workers/worker.js';

const log = NLog.getInstance();

async function serverRun() {
  await initProxyPool(Boolean(process.env.DEBUG_POOL));

  const srv1 = await RMQ_serverQuery.createRMQ_serverQuery(
    proxyRMQnames.exchange,
    proxyRMQnames.getproxy,
    proxyRMQnames.getproxy,
    workerBase,
    getProxy,
  );
  // второй метод - returnProxy
  srv1.addQueues(proxyRMQnames.returnProxy, workerBase, returnProxy);
}

await serverRun();
