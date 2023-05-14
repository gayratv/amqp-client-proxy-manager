import { RMQ_proxyClientQuery } from './clients.js';
import { proxyRMQnames, TIME_LEASED_PROXY_DEFAULT } from '../../config/config-rmq.js';
import { GetProxyReturn, ParamGetProxy, ParamReturnProxy } from '../types/types.js';
import { ErrType, GetProxyClient, IProxyManager } from '../types/proxy-manager-interface.js';

export class ProxyGet implements IProxyManager {
  private static instanceRMQ_proxyClientQuery: RMQ_proxyClientQuery = null;
  private static instance: ProxyGet = null;

  // конструктор нельзя вызвать
  private constructor() {}

  static async getInstance() {
    if (ProxyGet.instance) return ProxyGet.instance;

    const pget = new ProxyGet();
    ProxyGet.instance = pget;

    const cli = await RMQ_proxyClientQuery.createRMQ_clientQuery(
      proxyRMQnames.exchange,
      proxyRMQnames.getproxy,
      proxyRMQnames.getproxy,
    );
    ProxyGet.instanceRMQ_proxyClientQuery = cli;

    return pget;
  }

  async getProxy(leasedTime: number): Promise<GetProxyClient | ErrType> {
    const res = await ProxyGet.instanceRMQ_proxyClientQuery.sendRequestAndResieveAnswer<ParamGetProxy, GetProxyReturn>(
      proxyRMQnames.getproxy,
      {
        leasedTime,
      },
    );
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
  async returnProxy(uniqueKey: string) {
    ProxyGet.instanceRMQ_proxyClientQuery.sendRequestOnly<ParamReturnProxy>(proxyRMQnames.returnProxy, {
      uniqueKey,
    });
  }
}

export async function getProxy(leasedTime = TIME_LEASED_PROXY_DEFAULT) {
  const inst = await ProxyGet.getInstance();
  return inst.getProxy(leasedTime);
}

export async function returnProxy(uniqueKey: string): Promise<void> {
  const inst = await ProxyGet.getInstance();
  return inst.returnProxy(uniqueKey);
}
