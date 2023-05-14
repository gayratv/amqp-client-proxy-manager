import dayjs from 'dayjs';
import { NLog } from 'tslog-fork';
import { retriableQuery } from '../../helpers/mysql-helper.js';
/*
 * fillProxyPool(debug: boolean, r: ResourceManager) {
 * загружает список доступных proxy
 */
export async function fillProxyPool(debug) {
    const log = NLog.getInstance();
    log.info('fillProxyPool debug ', debug);
    // список свободных проверенных proxy
    const sqlBase = `select idProxyList,proxyServer from proxyList where proxyServerBlocked=0 and assignedToProfile is null and checkedForAvito=1`;
    let sql = sqlBase;
    if (debug)
        sql = sql + ' limit 3';
    const [proxyList, _] = await retriableQuery(sql);
    const proxyIpPool = proxyList.map((val) => {
        const p = {
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
//# sourceMappingURL=proxy-db-init.js.map