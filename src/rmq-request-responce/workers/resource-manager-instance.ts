import { NLog } from 'tslog-fork';
import { fillProxyPool, ResourceManager } from '../../resource-manage/index.js';

export const resourceManager = new ResourceManager(NLog.getInstance());

export async function initProxyPool(debug = false) {
  const proxyPool = await fillProxyPool(debug);
  resourceManager.setproxyIpPool(proxyPool);
}
