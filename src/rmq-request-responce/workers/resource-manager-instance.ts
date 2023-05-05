import { NLog } from 'tslog-fork';
import { fillProxyPool, ResourceManager } from '../../resource-manage/index.js';

export const resourceManager = new ResourceManager(NLog.getInstance());

export async function initProxyPool() {
  const proxyPool = await fillProxyPool(true);
  resourceManager.setproxyIpPool(proxyPool);
}
