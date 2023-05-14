import { RMQ_proxyClientQuery } from './clients.js';
import { proxyRMQnames, TIME_LEASED_PROXY_DEFAULT } from '../../config/config-rmq.js';
export class ProxyGet {
    static instanceRMQ_proxyClientQuery = null;
    static instance = null;
    // конструктор нельзя вызвать
    constructor() { }
    static async getInstance() {
        if (ProxyGet.instance)
            return ProxyGet.instance;
        const pget = new ProxyGet();
        ProxyGet.instance = pget;
        const cli = await RMQ_proxyClientQuery.createRMQ_clientQuery(proxyRMQnames.exchange, proxyRMQnames.getproxy, proxyRMQnames.getproxy);
        ProxyGet.instanceRMQ_proxyClientQuery = cli;
        return pget;
    }
    async getProxy(leasedTime) {
        const res = await ProxyGet.instanceRMQ_proxyClientQuery.sendRequestAndResieveAnswer(proxyRMQnames.getproxy, {
            leasedTime,
        });
        return { proxy: res.userData.userData, uniqueKey: res.userData.uniqueKey };
    }
    /*
  пример ответа
  p1.userData.uniqueKey
  
  { userData:
     { userData:
        { server: 'http://104.239.80.193:5771', password: '[***]', username: 'wmdzslaf' },
       uniqueKey: '6',
       lastUse: '2023-05-13T18:36:07.796Z',
       state: 'USING',
       orderPos: 4,
       leasedTime: 3000
       }
     }
  
   */
    /*
      возврат в код происходит почти мгновенно
     */
    async returnProxy(uniqueKey) {
        ProxyGet.instanceRMQ_proxyClientQuery.sendRequestOnly(proxyRMQnames.returnProxy, {
            uniqueKey,
        });
    }
}
export async function getProxy(leasedTime = TIME_LEASED_PROXY_DEFAULT) {
    const inst = await ProxyGet.getInstance();
    return inst.getProxy(leasedTime);
}
export async function returnProxy(uniqueKey) {
    const inst = await ProxyGet.getInstance();
    return inst.returnProxy(uniqueKey);
}
//# sourceMappingURL=proxy-get.js.map