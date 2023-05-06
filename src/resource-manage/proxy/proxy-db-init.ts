import dayjs from 'dayjs';
import { ProxyObject, ResourceManager } from '../lib/resource-manager.js';
import { RowDataPacket } from 'mysql2';
import { NLog } from 'tslog-fork';
import { Proxy } from '../types/Database.js';
import { retriableQuery } from '../../helpers/mysql-helper.js';

interface proxyServerDB extends RowDataPacket {
  idProxyList: number;
  proxyServer: Proxy;
}

/*
 * fillProxyPool(debug: boolean, r: ResourceManager) {
 * загружает список доступных proxy
 */
export async function fillProxyPool(debug: boolean) {
  const log = NLog.getInstance();
  // список свободных проверенных proxy
  const sqlBase = `select idProxyList,proxyServer from proxyList where proxyServerBlocked=0 and assignedToProfile is null and checkedForAvito=1`;
  let sql: string = sqlBase;
  if (debug) sql = sql + ' limit 3';
  const [proxyList, _] = await retriableQuery<proxyServerDB[]>(sql);
  const proxyIpPool = proxyList.map((val) => {
    const p: ProxyObject<Proxy> = {
      userData: val.proxyServer,
      uniqueKey: val.idProxyList.toString(),
      lastUse: dayjs().subtract(1, 'minute'),
      state: 'FREE',
      orderPos: 0,
      leasedTime: -1,
    };
    return p;
  });
  log.info('Пул IP заполнен, количество IP в пуле : ', proxyIpPool.length);
  return proxyIpPool;
}
// r.setproxyIpPool(proxyIpPool);
