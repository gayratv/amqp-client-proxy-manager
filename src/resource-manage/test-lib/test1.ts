import { NLog } from 'tslog-fork';
import { ResourceManager } from '../lib/resource-manager.js';
import { delay } from '../../helpers/common.js';
import { fillProxyPool } from '../proxy/proxy-db-init.js';
import { Proxy } from '../types/Database.js';

const log = NLog.getInstance();

async function main() {
  const r = new ResourceManager(NLog.getInstance());
  const proxyPool = await fillProxyPool(true);
  r.setproxyIpPool(proxyPool);

  for (let i = 0; i < 5; i++) {
    const data = await r.getResource<Proxy>();
    // log.debug('resource allocated uniqueKey : ', data.uniqueKey);
  }

  r.printProxyPoolInfo();
  // нет await
  r.returnResourceByKey('104');
  log.info('after returnResourceByKey');
  // ресурс 104 будет освобожден на 3 секунде
  await r.getResource<Proxy>(15_000);
  await delay(1_000);
  await r.getResource<Proxy>(0);
  await delay(7_000);
  r.printProxyPoolInfo();
  await delay(10_000);
  r.printProxyPoolInfo();
  await delay(12_000);
  r.printProxyPoolInfo();
}
await main();
process.exit(0);

// returnResourceByKey;
